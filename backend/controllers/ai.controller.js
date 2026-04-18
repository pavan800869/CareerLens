import dotenv from "dotenv";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { getJson } from "serpapi";
import axios from "axios";
import { fetchResumeText } from "../utils/parseResume.js";
import {
  applicationPromptTemplate,
  careerPathwayTemplate,
  rankingPromptTemplate,
} from "../utils/prompt.templates.js";

import { ChatGroq } from "@langchain/groq";

import { StructuredOutputParser } from "@langchain/core/output_parsers";

dotenv.config(); // Load environment variables
// Initialize Groq
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  maxOutputTokens: 2048,
});

function parseToJson(input) {
  try {
    // First, try to parse as pure JSON
    const cleaned = input
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/i, '')
      .replace(/^```\s*/i, '')
      .trim();
    
    const parsed = JSON.parse(cleaned);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (jsonError) {
    console.log('Direct JSON parse failed, trying fallback:', jsonError.message);
  }

  // Fallback: Try to parse markdown format if JSON fails
  try {
    const sections = input.split(/\n(?=\*\*)/).filter(Boolean);
    const result = {};

    sections.forEach((section) => {
      const [headerLine, ...contentLines] = section.split("\n").filter(Boolean);
      const header = headerLine.replace(/\*\*/g, "").trim();
      const content = contentLines.map((line) => {
        if (line.startsWith("- **")) {
          const [key, value] = line
            .slice(2)
            .split(":")
            .map((str) => str.trim());
          return { [key]: value };
        }
        return line.replace(/^- /, "").trim();
      });

      result[header] = content.flat();
    });

    return Object.keys(result).length > 0 ? result : null;
  } catch (fallbackError) {
    console.error('All parsing attempts failed:', fallbackError.message);
    return null;
  }
}

// LangChain PromptTemplate setup
const prompt = new PromptTemplate({
  template: careerPathwayTemplate,
  inputVariables: ["title", "description", "requirements"],
});

const applicationPrompt = new PromptTemplate({
  template: applicationPromptTemplate,
  inputVariables: ["jobRequirements", "skills", "resumeText", "socialProfiles"],
});

const rankingPrompt = new PromptTemplate({
  template: rankingPromptTemplate,
  inputVariables: ["aiInsights"],
});

// Async function to generate the career pathway
export const generateJobPathway = async (jobId) => {
  try {
    // Step 1: Fetch Job Details
    const job = await Job.findById(jobId);
    if (!job) throw new Error("Job not found");

    // Check if pathway is already generated and cached in the database
    if (job.careerPathway && Object.keys(job.careerPathway).length > 0) {
      console.log("Returning cached career pathway for job:", job._id);
      return {
        status: "success",
        job: {
          id: job._id,
          title: job.title,
          description: job.description,
          requirements: job.requirements,
        },
        pathStr: "", // Raw string not cached, but UI relies mostly on pathParsed
        pathJson: { text: JSON.stringify(job.careerPathway) },
        pathParsed: job.careerPathway,
        certifications: job.certifications || [],
      };
    }

    // Step 2: Generate Career Pathway using LangChain
    const chain = new LLMChain({ llm, prompt });
    const initialPathway = await chain.call({
      title: job.title,
      description: job.description,
      requirements: job.requirements.join(", "),
    });

    // Validate the initialPathway response
    if (!initialPathway || !initialPathway.text) {
      throw new Error("Failed to generate pathway from LangChain");
    }

    const properPathWay = parseToJson(initialPathway.text.trim());

    console.log("proper pathway is: ",properPathWay)

    // Step 3: Fetch Live Certifications using SerpAPI
    let certifications = [];
    try {
      const query = `Top certifications or courses for ${job.title}`;
      const searchResults = await getJson({
        engine: "google",
        q: query,
        api_key: process.env.SERP_API_KEY,
      });

      certifications = searchResults?.organic_results?.map((result) => ({
        title: result.title,
        link: result.link,
      })) || [];
    } catch (certError) {
      console.error("Error fetching certifications:", certError);
    }

    // Cache the generated pathway and certifications into the database
    if (properPathWay) {
      job.careerPathway = properPathWay;
      job.certifications = certifications;
      await job.save();
      console.log("Saved newly generated career pathway to database for job:", job._id);
    }

    // Step 4: Combine and Return Results
    return {
      status: "success",
      job: {
        id: job._id,
        title: job.title,
        description: job.description,
        requirements: job.requirements,
      },
      pathStr: initialPathway.text.trim(),
      pathJson: initialPathway,
      pathParsed: properPathWay, // Include parsed JSON structure
      certifications,
    };
  } catch (error) {
    console.error("Error generating job pathway:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

// Route to get AI-enhanced applicants for a job
export const getApplicantsWithAI = async (req, res) => {
  try {
    const jobId = req.params.id;
    const forceRefresh = req.query.refresh === 'true' || req.query.refresh === true; // Allow force refresh via query param

    // Fetch job and applicants
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Extract job details for matching
    const jobRequirements = Array.isArray(job.requirements) ? job.requirements : [];

    // Process each applicant with AI sequentially to avoid rate limits
    const processedApplicants = [];
    for (let i = 0; i < job.applications.length; i++) {
      const application = job.applications[i];
      
      try {
        const applicant = application.applicant;
        const socials = Array.isArray(applicant?.profile?.socialLinks) ? applicant.profile.socialLinks : [];
        const skills = Array.isArray(applicant?.profile?.skills) ? applicant.profile.skills : [];

        // Check if AI insights are already cached (within last 24 hours)
        const applicationDoc = await Application.findById(application._id);
        const cacheAge = applicationDoc?.aiInsightsGeneratedAt 
          ? (Date.now() - new Date(applicationDoc.aiInsightsGeneratedAt).getTime()) / (1000 * 60 * 60) // hours
          : Infinity;
        
        // Use cache if it exists, is less than 24 hours old, and force refresh is not requested
        const useCache = !forceRefresh && applicationDoc?.aiInsights && applicationDoc?.aiRankingScore && cacheAge < 24;
        
        let aiInsights = '';
        let rankingScore = '';

        if (useCache) {
          console.log(`Using cached AI insights for applicant ${applicant?._id} (age: ${cacheAge.toFixed(2)} hours)`);
          aiInsights = applicationDoc.aiInsights;
          rankingScore = applicationDoc.aiRankingScore;
        } else {
          console.log(`Generating new AI insights for applicant ${applicant?._id}...`);
          
          // Parse resume (assuming resumes are stored as URLs)
          const resumeUrl = applicant?.profile?.resume || '';
          const resumeOriginalName = applicant?.profile?.resumeOriginalName || '';
          const resumeText = resumeUrl ? await fetchResumeText(resumeUrl, resumeOriginalName) : '';
          
          if (!resumeText) {
            console.warn(`No resume text extracted for applicant ${applicant?._id}. URL: ${resumeUrl}`);
          } else {
            console.log(`Resume text extracted for applicant ${applicant?._id}: ${resumeText.length} characters`);
            console.log(`Resume text preview (first 200 chars): ${resumeText.substring(0, 200)}`);
          }

          // Prepare inputs for AI - truncate resume text if too long (LLM context limits)
          // Most LLMs have token limits, so we'll use first 3000 characters of resume text
          const truncatedResumeText = resumeText ? resumeText.substring(0, 3000) : '';
          if (resumeText && resumeText.length > 3000) {
            console.log(`Resume text truncated from ${resumeText.length} to 3000 characters for AI processing`);
          }

          // Step 1: Generate AI insights
          console.log(`Generating AI insights for applicant ${applicant?._id}...`);
          const insightsChain = new LLMChain({ llm, prompt: applicationPrompt });
          const insightsResponse = await insightsChain.call({
            jobRequirements: jobRequirements.join(", "),
            skills: skills.join(", "),
            resumeText: truncatedResumeText || resumeText,
            socialProfiles: socials.join(", "),
          });

          console.log(`AI insights generated for applicant ${applicant?._id}. Response length: ${insightsResponse?.text?.length || 0}`);
          console.log(`AI insights preview (first 300 chars): ${insightsResponse?.text?.substring(0, 300) || 'No response'}`);

          aiInsights = insightsResponse?.text?.trim() || '';

          // Add delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100));

          console.log(`Generating ranking score for applicant ${applicant?._id}...`);
          const rankingChain = new LLMChain({ llm, prompt: rankingPrompt });
          const rankingResponse = await rankingChain.call({
            aiInsights: aiInsights,
          });

          rankingScore = rankingResponse?.text?.trim() || '';
          console.log(`Ranking score generated for applicant ${applicant?._id}. Response length: ${rankingScore.length}`);
          console.log(`Ranking score preview (first 200 chars): ${rankingScore.substring(0, 200) || 'No response'}`);

          // Cache the AI-generated data in the database
          if (applicationDoc) {
            applicationDoc.aiInsights = aiInsights;
            applicationDoc.aiRankingScore = rankingScore;
            applicationDoc.aiInsightsGeneratedAt = new Date();
            await applicationDoc.save();
            console.log(`Cached AI insights for applicant ${applicant?._id}`);
          }
        }

        // Return the structured output
        processedApplicants.push({
          applicant: {
            id: applicant._id,
            fullname: applicant.fullname,
            email: applicant.email,
            skills: skills,
          },
          insights: aiInsights,
          rankingScore: rankingScore,
        });
      } catch (err) {
        console.error('Applicant AI processing error:', err);
        processedApplicants.push({
          applicant: {
            id: application?.applicant?._id,
            fullname: application?.applicant?.fullname,
            email: application?.applicant?.email,
            skills: Array.isArray(application?.applicant?.profile?.skills) ? application.applicant.profile.skills : [],
          },
          insights: '',
          rankingScore: '',
        });
      }

      // Add delay between applicants to respect rate limits
      if (i < job.applications.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return res.status(200).json({
      job: {
        id: job._id,
        title: job.title,
        description: job.description,
      },
      applicants: processedApplicants,
      success: true,
    });
  } catch (error) {
    console.error("Error in AI-enhanced applicants route:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
