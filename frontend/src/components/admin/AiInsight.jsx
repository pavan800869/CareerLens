import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplicantCard from "./AdminApplicant";

function parseInsights(insights) {
  try {
    if (!insights || typeof insights !== 'string') {
      console.warn('Insights is not a string:', typeof insights, insights);
      return null;
    }
    
    let cleanInsights = insights
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/\s*```\s*$/gi, '')
      .trim();
    
    const jsonMatch = cleanInsights.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanInsights = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanInsights);
    console.log('Successfully parsed insights:', parsed);
    return parsed;
  } catch (error) {
    console.error('Error parsing insights:', error);
    console.error('Raw insights value:', insights);
    console.error('Cleaned insights (first 500 chars):', insights?.substring(0, 500));
    return null;
  }
}

function parseRankingScore(rankingScore) {
  try {
    if (!rankingScore || typeof rankingScore !== 'string') {
      console.warn('Ranking score is not a string:', typeof rankingScore, rankingScore);
      return null;
    }
    
    let cleanRankingScore = rankingScore
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/\s*```\s*$/gi, '')
      .trim();
    
    const jsonMatch = cleanRankingScore.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanRankingScore = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanRankingScore);
    console.log('Successfully parsed ranking score:', parsed);
    return parsed;
  } catch (error) {
    console.error('Error parsing ranking score:', error);
    console.error('Raw ranking score value:', rankingScore);
    console.error('Cleaned ranking score (first 500 chars):', rankingScore?.substring(0, 500));
    return null;
  }
}

const JobInsights = ({ jobId }) => {
  const [jobData, setJobData] = useState(null);
  const [applicantsData, setApplicantsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        console.log('Fetching AI insights for job:', jobId);
        const response = await axios.get(`http://localhost:8000/api/v1/ai/jobs/${jobId}/applicants`);
        const data = response.data;
        console.log('Received AI data:', data);
        console.log('Applicants count:', data.applicants?.length);
        
        setJobData(data.job);
        setApplicantsData(data.applicants || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        console.error("Error response:", error.response?.data);
        setLoading(false);
      }
    };

    if (jobId) fetchJobData();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-purple mx-auto mb-3"></div>
          <span className="text-muted-foreground text-sm">Loading AI insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 fade-in">
      <h1 className="text-2xl font-bold text-foreground">Job Insights</h1>
      
      {/* Job Details Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Job Title</h2>
            <p className="text-lg font-semibold text-foreground">{jobData?.title}</p>
          </div>
          <div className="flex-1 md:ml-8">
            <h2 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{jobData?.description}</p>
          </div>
        </div>
      </div>

      {/* Applicants */}
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <span className="w-1 h-5 bg-neon-purple rounded-full"></span>
        Applicants
        <span className="badge-purple text-xs px-3 py-1 rounded-full ml-1">{applicantsData.length}</span>
      </h3>
      <div className="grid grid-cols-1 gap-5">
        {applicantsData.length === 0 && <p className="text-slate-500 text-sm text-center py-10">No applicants available.</p>}
        {applicantsData?.map((applicant) => {
          const parsedInsights = parseInsights(applicant.insights);
          const parsedRankingScore = parseRankingScore(applicant.rankingScore);
          
          console.log('Processing applicant:', applicant.applicant?.fullname);
          console.log('Parsed insights:', parsedInsights);
          console.log('Parsed ranking score:', parsedRankingScore);

          return (
          <ApplicantCard
            key={applicant.applicant.id}
            applicant={applicant.applicant}
            insights={parsedInsights}
            rankingScore={parsedRankingScore}
          />)
        })}
      </div>
    </div>
  );
};

export default JobInsights;
