import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Button } from '../ui/button';
import { Lightbulb, WebcamIcon, Loader2 } from 'lucide-react';
import Webcam from 'react-webcam';

const InterviewSetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.get(`${INTERVIEW_API_END_POINT}/${id}`, { withCredentials: true });
        if (res.data.success) {
          setInterviewData(res.data.interview);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Interview not found</h2>
        <Button onClick={() => navigate('/ai-mock-interview')} className="gradient-btn text-white">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 fade-in">
      <h2 className="font-bold text-3xl text-foreground mb-8">Let's Get Started</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 border-l-4 border-l-neon-purple">
            <h3 className="text-sm text-muted-foreground mb-1">Job Role</h3>
            <p className="text-lg text-foreground font-semibold mb-4">{interviewData.jobPosition}</p>
            
            <h3 className="text-sm text-muted-foreground mb-1">Job Description</h3>
            <p className="text-sm text-foreground mb-4 line-clamp-3">{interviewData.jobDesc}</p>
            
            <h3 className="text-sm text-muted-foreground mb-1">Experience</h3>
            <p className="text-sm text-foreground">{interviewData.jobExperience} Years</p>
          </div>
          
          <div className="p-5 border border-yellow-500/20 rounded-xl bg-yellow-500/5 backdrop-blur-md">
            <h2 className="flex gap-2 items-center text-yellow-500 font-semibold mb-2">
              <Lightbulb className="w-5 h-5" /> Information
            </h2>
            <p className="text-sm text-yellow-500/90 leading-relaxed">
              Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. 
              It has 10 questions which you can answer and at the last you will get the report 
              on the basis of your answer. NOTE: We never record your video, Web cam access you can disable at any time.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          {webCamEnabled ? (
            <div className="glass-card p-2 w-full max-w-md aspect-video overflow-hidden border-neon-cyan/30">
              <Webcam
                mirrored={true}
                className="w-full h-full object-cover rounded-lg"
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
              />
            </div>
          ) : (
            <div className="glass-card w-full max-w-md aspect-video flex flex-col items-center justify-center gap-4 border-dashed border-2">
              <WebcamIcon className="w-16 h-16 text-slate-600" />
              <Button 
                variant="outline" 
                onClick={() => setWebCamEnabled(true)}
                className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
              >
                Enable Web Cam & Microphone
              </Button>
            </div>
          )}
          
          <div className="w-full max-w-md flex justify-end mt-8">
            <Button 
              onClick={() => navigate(`/ai-mock-interview/${id}/start`)}
              className="gradient-btn text-white w-full py-6 text-lg"
              disabled={!webCamEnabled}
            >
              Start Interview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
