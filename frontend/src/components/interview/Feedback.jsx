import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Button } from '../ui/button';
import { ChevronDown, Loader2 } from 'lucide-react';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`${INTERVIEW_API_END_POINT}/${id}/feedback`, { withCredentials: true });
        if (res.data.success) {
          setFeedbackList(res.data.feedbackList);
          setAvgRating(res.data.avgRating);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-neon-purple" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 fade-in">
      {feedbackList.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-2">
          <h2 className="text-2xl font-bold text-muted-foreground mb-4">No Feedback Found</h2>
          <p className="text-slate-500 mb-8">It seems you didn't answer any questions in this interview.</p>
          <Button onClick={() => navigate('/ai-mock-interview')} className="gradient-btn text-white">
            Go to Dashboard
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-emerald-400 mb-2 glow-green">Congratulations!</h2>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Here is your interview feedback</h3>
            
            <div className="inline-block glass-card px-8 py-4 border-border mb-4">
              <span className="text-muted-foreground mr-2">Overall Rating:</span>
              <strong className={`text-2xl ${avgRating < 6 ? 'text-red-500 glow-red' : 'text-emerald-400 glow-green'}`}>
                {avgRating}/10
              </strong>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Review the questions below along with the correct answers, your recorded answers, and personalized AI feedback for improvement.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {feedbackList.map((item, index) => (
              <div key={index} className="glass-card border border-border overflow-hidden transition-all">
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-accent"
                  onClick={() => toggleItem(index)}
                >
                  <h3 className="text-foreground font-medium pr-8">{item.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openItems[index] ? 'rotate-180' : ''}`} />
                </div>
                
                {openItems[index] && (
                  <div className="p-5 border-t border-border bg-background/20 flex flex-col gap-4 fade-in">
                    <div className="inline-flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        item.rating < 6 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        Rating: {item.rating}/10
                      </span>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                      <strong className="text-red-400 text-sm mb-1 block">Your Answer:</strong>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.userAns}</p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                      <strong className="text-emerald-400 text-sm mb-1 block">Ideal Answer:</strong>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.correctAns}</p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-neon-purple/20 bg-neon-purple/5">
                      <strong className="text-neon-purple text-sm mb-1 block">AI Feedback:</strong>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => navigate('/ai-mock-interview')} className="gradient-btn text-white px-8 py-6 text-lg border-0 shadow-lg">
              Return to Dashboard
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Feedback;
