import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, AI_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import ApplicantCard from './AdminApplicant';

const shortlistingStatus = ['Accepted', 'Rejected'];

function parseInsights(insights) {
  try {
    if (!insights || typeof insights !== 'string') {
      console.warn('Insights is not a string:', typeof insights, insights);
      return null;
    }
    
    // Remove markdown code blocks more thoroughly
    let cleanInsights = insights
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/\s*```\s*$/gi, '')
      .trim();
    
    // Try to find JSON object in the string if it's embedded in other text
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
    
    // Remove markdown code blocks more thoroughly
    let cleanRankingScore = rankingScore
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/\s*```\s*$/gi, '')
      .trim();
    
    // Try to find JSON object in the string if it's embedded in other text
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

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);
  const [aiData, setAiData] = useState({ applicants: [], loading: true });
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const jobId = applicants?._id;
    if (!jobId) return;

    const fetchAIInsights = async () => {
      try {
        console.log('Fetching AI insights for job:', jobId);
        const response = await axios.get(`${AI_API_END_POINT}/jobs/${jobId}/applicants`);
        console.log('Received AI response:', response.data);
        console.log('Applicants in response:', response.data?.applicants?.length);
        
        const processed = (response.data?.applicants || []).map(a => {
          console.log('Processing applicant:', a.applicant?.fullname);
          console.log('Raw insights:', a.insights?.substring(0, 200));
          console.log('Raw ranking score:', a.rankingScore?.substring(0, 200));
          
          const parsedInsights = parseInsights(a.insights);
          const parsedRankingScore = parseRankingScore(a.rankingScore);
          
          console.log('Parsed insights result:', parsedInsights);
          console.log('Parsed ranking score result:', parsedRankingScore);
          
          return {
            ...a,
            insights: parsedInsights || {},
            rankingScore: parsedRankingScore || {}
          };
        });
        
        console.log('Processed applicants:', processed.length);
        setAiData({ applicants: processed, loading: false });
      } catch (error) {
        console.error('Error fetching AI insights:', error);
        console.error('Error response:', error.response?.data);
        setAiData({ applicants: [], loading: false });
      }
    };

    fetchAIInsights();
  }, [applicants?._id]);

  const statusHandler = async (status, applicationId) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleViewProfile = (applicant) => {
    const application = applicants?.applications?.find(app => app.applicant?._id === applicant.id);
    setSelectedApplicant({ ...applicant, application });
    setShowProfile(true);
  };

  const aiApplicantsMap = new Map(aiData.applicants.map(a => [a.applicant.id, a]));
  const allApplicants = (applicants?.applications || []).map(app => {
    const applicant = app.applicant;
    const aiDataForApplicant = aiApplicantsMap.get(applicant?._id?.toString());
    return {
      application: app,
      applicant: applicant,
      aiInsights: aiDataForApplicant?.insights,
      aiRanking: aiDataForApplicant?.rankingScore
    };
  });

  if (aiData.loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-purple mx-auto mb-3"></div>
          <span className='text-muted-foreground text-sm'>Loading applicant insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        Applicants <span className='badge-purple text-sm px-3 py-1 rounded-full ml-2'>{allApplicants.length}</span>
      </h1>

      {/* Profile Modal */}
      {showProfile && selectedApplicant && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Full Profile</h2>
              <button onClick={() => setShowProfile(false)} className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">✕</button>
            </div>
            <div className="space-y-4">
              <div className='glass-card p-4'>
                <h3 className="text-xs text-slate-500 font-medium">Name</h3>
                <p className="text-foreground text-sm mt-0.5">{selectedApplicant.fullname}</p>
              </div>
              <div className='glass-card p-4'>
                <h3 className="text-xs text-slate-500 font-medium">Email</h3>
                <p className="text-foreground text-sm mt-0.5">{selectedApplicant.email}</p>
              </div>
              <div className='glass-card p-4'>
                <h3 className="text-xs text-slate-500 font-medium">Contact</h3>
                <p className="text-foreground text-sm mt-0.5">{selectedApplicant.application?.applicant?.phoneNumber || 'N/A'}</p>
              </div>
              <div className='glass-card p-4'>
                <h3 className="text-xs text-slate-500 font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedApplicant.application?.applicant?.profile?.skills || []).map((skill, i) => (
                    <span key={i} className="badge-purple text-xs px-2.5 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
              <div className='glass-card p-4'>
                <h3 className="text-xs text-slate-500 font-medium">Resume</h3>
                {selectedApplicant.application?.applicant?.profile?.resume ? (
                  <a href={selectedApplicant.application.applicant.profile.resume} target="_blank" rel="noopener noreferrer" className="text-neon-purple text-sm hover:underline mt-0.5 inline-block">
                    {selectedApplicant.application.applicant.profile.resumeOriginalName || 'View Resume'}
                  </a>
                ) : (
                  <p className="text-slate-500 text-sm mt-0.5">No resume uploaded</p>
                )}
              </div>
              <div className='glass-card p-4'>
                <h3 className="text-xs text-slate-500 font-medium">Bio</h3>
                <p className="text-muted-foreground text-sm mt-0.5">{selectedApplicant.application?.applicant?.profile?.bio || 'N/A'}</p>
              </div>
              <div className='glass-card p-4'>
                <h3 className="text-xs text-slate-500 font-medium">Applied Date</h3>
                <p className="text-foreground text-sm mt-0.5">{new Date(selectedApplicant.application?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-3 pt-2">
                {shortlistingStatus.map((status) => (
                  <button
                    key={status}
                    onClick={() => statusHandler(status, selectedApplicant.application?._id)}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      status === 'Accepted' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        {allApplicants.length === 0 && <p className="text-center text-slate-500 py-10">No applicants yet.</p>}
        {allApplicants.map((item) => {
          const aiDataForThis = aiApplicantsMap.get(item.applicant?._id?.toString());
          if (!aiDataForThis) {
            return (
              <div key={item.application._id} className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-purple"></div>
                  <p className="text-muted-foreground text-sm">Processing AI insights for {item.applicant?.fullname}...</p>
                </div>
              </div>
            );
          }
          return (
            <div key={item.application._id} className="relative">
              <ApplicantCard
                applicant={aiDataForThis.applicant}
                insights={aiDataForThis.insights}
                rankingScore={aiDataForThis.rankingScore}
                onViewProfile={() => handleViewProfile(aiDataForThis.applicant)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicantsTable;
