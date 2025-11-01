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
    if (!insights || typeof insights !== 'string') return null;
    const cleanInsights = insights.replace(/^```json(?:n)?\n|\n```$/gi, '');
    return JSON.parse(cleanInsights);
  } catch (error) {
    console.error('Error parsing insights:', error);
    return null;
  }
}

function parseRankingScore(rankingScore) {
  try {
    if (!rankingScore || typeof rankingScore !== 'string') return null;
    const cleanRankingScore = rankingScore.replace(/^```json(?:n)?\n|\n```$/gi, '');
    return JSON.parse(cleanRankingScore);
  } catch (error) {
    console.error('Error parsing ranking score:', error);
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
        const response = await axios.get(`${AI_API_END_POINT}/jobs/${jobId}/applicants`);
        const processed = (response.data?.applicants || []).map(a => ({
          ...a,
          insights: parseInsights(a.insights) || {},
          rankingScore: parseRankingScore(a.rankingScore) || {}
        }));
        setAiData({ applicants: processed, loading: false });
      } catch (error) {
        console.error('Error fetching AI insights:', error);
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
      <div className="flex justify-center items-center min-h-screen text-xl">
        <span>Loading applicant insights...</span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Applicants ({allApplicants.length})</h1>

      {showProfile && selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Full Profile</h2>
              <button onClick={() => setShowProfile(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Name:</h3>
                <p>{selectedApplicant.fullname}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email:</h3>
                <p>{selectedApplicant.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Contact:</h3>
                <p>{selectedApplicant.application?.applicant?.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Skills:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(selectedApplicant.application?.applicant?.profile?.skills || []).map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Resume:</h3>
                {selectedApplicant.application?.applicant?.profile?.resume ? (
                  <a href={selectedApplicant.application.applicant.profile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {selectedApplicant.application.applicant.profile.resumeOriginalName || 'View Resume'}
                  </a>
                ) : (
                  <p className="text-gray-500">No resume uploaded</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Bio:</h3>
                <p>{selectedApplicant.application?.applicant?.profile?.bio || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Applied Date:</h3>
                <p>{new Date(selectedApplicant.application?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 pt-4">
                {shortlistingStatus.map((status) => (
                  <button
                    key={status}
                    onClick={() => statusHandler(status, selectedApplicant.application?._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {allApplicants.length === 0 && <p className="text-center text-gray-500">No applicants yet.</p>}
        {allApplicants.map((item) => {
          const aiDataForThis = aiApplicantsMap.get(item.applicant?._id?.toString());
          if (!aiDataForThis) {
            return (
              <div key={item.application._id} className="bg-white border rounded-lg p-4">
                <p className="text-gray-500">Processing AI insights for {item.applicant?.fullname}...</p>
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
