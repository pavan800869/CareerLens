import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Clock, PlayCircle } from 'lucide-react';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get(`${INTERVIEW_API_END_POINT}/list`, { withCredentials: true });
        if (res.data.success) {
          setInterviews(res.data.interviews);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Previous Interviews</h2>
      
      {interviews.length === 0 ? (
        <div className="glass-card p-8 text-center border-dashed border-2 border-border">
          <p className="text-muted-foreground">No mock interviews yet. Create one above to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.map((interview) => (
            <div key={interview._id} className="glass-card p-6 card-hover flex flex-col h-full">
              <h3 className="font-bold text-lg text-foreground mb-1 truncate">{interview.jobPosition}</h3>
              <p className="text-sm text-muted-foreground mb-3 truncate">{interview.jobExperience} Years Experience</p>
              
              <div className="flex items-center text-xs text-slate-500 mb-6 gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="mt-auto flex gap-3">
                <Button 
                  onClick={() => navigate(`/ai-mock-interview/${interview.mockId}/feedback`)}
                  variant="outline" 
                  className="flex-1 border-border hover:bg-accent text-muted-foreground"
                >
                  Feedback
                </Button>
                <Button 
                  onClick={() => navigate(`/ai-mock-interview/${interview.mockId}`)}
                  className="flex-1 gradient-btn border-0 text-foreground"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;
