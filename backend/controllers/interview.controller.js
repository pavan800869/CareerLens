import { GoogleGenerativeAI } from "@google/generative-ai";
import { Interview } from "../models/interview.model.js";
import { UserAnswer } from "../models/userAnswer.model.js";
import { v4 as uuidv4 } from "uuid";

// genAI will be initialized dynamically inside functions to avoid dotenv ES module hoisting issues

// Create a new interview
export const createInterview = async (req, res) => {
  try {
    const userId = req.id;
    const { jobPosition, jobDesc, jobExperience } = req.body;

    if (!jobPosition || !jobDesc || !jobExperience) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const questionCount = 10;
    const prompt = `Generate ${questionCount} interview questions and answers in JSON format based on the following: Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Return ONLY a valid JSON array of objects with "question" and "answer" fields. No markdown, no extra text.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${JSON.stringify(data)}`);
    }

    let responseText = data.choices[0].message.content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Validate JSON
    JSON.parse(responseText);

    const mockId = uuidv4();
    const interview = await Interview.create({
      mockId,
      jsonMockResp: responseText,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Interview created successfully",
      success: true,
      interview: {
        mockId: interview.mockId,
        _id: interview._id,
      },
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return res.status(500).json({
      message: "Failed to create interview",
      success: false,
    });
  }
};

// Get interview by mockId
export const getInterview = async (req, res) => {
  try {
    const { mockId } = req.params;
    const interview = await Interview.findOne({ mockId });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return res.status(500).json({
      message: "Failed to fetch interview",
      success: false,
    });
  }
};

// Get all interviews for a user
export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.id;
    const interviews = await Interview.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .select("-jsonMockResp");

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({
      message: "Failed to fetch interviews",
      success: false,
    });
  }
};

// Save user answer + get AI feedback
export const saveAnswer = async (req, res) => {
  try {
    const userId = req.id;
    const { mockId, question, correctAns, userAns } = req.body;

    if (!mockId || !question || !userAns) {
      return res.status(400).json({
        message: "mockId, question, and userAns are required",
        success: false,
      });
    }

    // Get AI feedback
    const feedbackPrompt = `Question: ${question}, User Answer: ${userAns}. Based on the question and the user's answer, please provide a rating 1 to 10 for the answer and feedback in the form of areas for improvement, if any. Return ONLY valid JSON with fields "rating" (number) and "feedback" (string), in 3 to 5 lines. No markdown, no extra text.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: feedbackPrompt }],
        temperature: 0.5
      })
    });

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${JSON.stringify(data)}`);
    }

    let feedbackText = data.choices[0].message.content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const feedbackJson = JSON.parse(feedbackText);

    const answer = await UserAnswer.create({
      mockId,
      question,
      correctAns: correctAns || "",
      userAns,
      feedback: feedbackJson.feedback || "",
      rating: Number(feedbackJson.rating) || 0,
      userId,
    });

    return res.status(201).json({
      message: "Answer saved successfully",
      success: true,
      answer: {
        _id: answer._id,
        rating: answer.rating,
        feedback: answer.feedback,
      },
    });
  } catch (error) {
    console.error("Error saving answer:", error);
    return res.status(500).json({
      message: "Failed to save answer",
      success: false,
    });
  }
};

// Get feedback for an interview
export const getInterviewFeedback = async (req, res) => {
  try {
    const { mockId } = req.params;
    const answers = await UserAnswer.find({ mockId }).sort({ createdAt: 1 });

    let avgRating = 0;
    if (answers.length > 0) {
      const totalRating = answers.reduce((sum, a) => sum + (a.rating || 0), 0);
      avgRating = Math.round(totalRating / answers.length);
    }

    return res.status(200).json({
      success: true,
      feedbackList: answers,
      avgRating,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({
      message: "Failed to fetch feedback",
      success: false,
    });
  }
};
