import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { Button } from '../ui/button';
import { Lightbulb, Volume2, Mic, StopCircle, Loader2 } from 'lucide-react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';

const StartInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingAnswer, setSavingAnswer] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.get(`${INTERVIEW_API_END_POINT}/${id}`, { withCredentials: true });
        if (res.data.success) {
          setInterviewData(res.data.interview);
          const parsedQuestions = JSON.parse(res.data.interview.jsonMockResp);
          setQuestions(parsedQuestions);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  useEffect(() => {
    if (results && results.length > 0) {
      setUserAnswer(prev => prev + (results[results.length - 1]?.transcript || " "));
    }
  }, [results]);

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      toast.error('Your browser does not support text to speech');
    }
  };

  const startStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const saveUserAnswer = async () => {
    try {
      setSavingAnswer(true);
      const res = await axios.post(`${INTERVIEW_API_END_POINT}/answer`, {
        mockId: id,
        question: questions[activeQuestionIndex]?.question,
        correctAns: questions[activeQuestionIndex]?.answer,
        userAns: userAnswer
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success('Answer recorded and evaluated successfully!');
        setUserAnswer('');
        setResults([]);
        
        // Auto advance to next question or feedback
        if (activeQuestionIndex < questions.length - 1) {
          setActiveQuestionIndex(prev => prev + 1);
        } else {
          navigate(`/ai-mock-interview/${id}/feedback`);
        }
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save answer');
    } finally {
      setSavingAnswer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (questions.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Questions Section */}
        <div className="glass-card p-6 flex flex-col h-full">
          <div className="flex flex-wrap gap-3 mb-8">
            {questions.map((q, index) => (
              <div 
                key={index} 
                className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                  activeQuestionIndex === index 
                    ? 'bg-neon-purple text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]' 
                    : 'bg-accent text-muted-foreground hover:bg-secondary'
                }`}
                onClick={() => setActiveQuestionIndex(index)}
              >
                Question #{index + 1}
              </div>
            ))}
          </div>

          <div className="flex-1">
            <h2 className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-4">
              {questions[activeQuestionIndex]?.question}
            </h2>
            <button 
              onClick={() => textToSpeech(questions[activeQuestionIndex]?.question)}
              className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground mb-8"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border border-blue-500/20 rounded-xl bg-blue-500/5 backdrop-blur-md mt-auto">
            <h2 className="flex gap-2 items-center text-blue-400 font-semibold mb-2">
              <Lightbulb className="w-5 h-5" /> Note:
            </h2>
            <p className="text-sm text-blue-400/80">
              Click on Record Answer when you want to answer the question. At the end of the interview we will give you the feedback along with correct answer for each of question and your answer to compare it.
            </p>
          </div>
        </div>

        {/* Video & Recording Section */}
        <div className="flex flex-col items-center justify-start gap-6">
          <div className="glass-card p-2 w-full max-w-lg aspect-video overflow-hidden border-neon-cyan/20">
            <Webcam
              mirrored={true}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <Button 
            disabled={savingAnswer} 
            onClick={startStopRecording} 
            className={`w-full max-w-lg py-6 text-lg border-0 transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' 
                : 'gradient-btn text-white'
            }`}
          >
            {savingAnswer ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving & Evaluating...</>
            ) : isRecording ? (
              <><StopCircle className="w-5 h-5 mr-2" /> Stop Recording</>
            ) : (
              <><Mic className="w-5 h-5 mr-2" /> Record Answer</>
            )}
          </Button>

          {error && (
            <div className="w-full max-w-lg p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mt-2">
              <strong>Microphone Error:</strong> {error}
              <br/>
              Ensure you are using Chrome/Edge on localhost or HTTPS, and have granted microphone permissions.
            </div>
          )}

          <div className="w-full max-w-lg mt-2">
            <label className="text-sm text-muted-foreground mb-2 block">Your Answer:</label>
            <textarea
              className="w-full bg-secondary/50 rounded-lg border border-border p-4 text-foreground min-h-[120px] focus:outline-none focus:border-neon-cyan/50 resize-y"
              placeholder={isRecording ? "Listening..." : "Click 'Record Answer' or type your answer here..."}
              value={isRecording ? (userAnswer + (interimResult || "")) : userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isRecording || savingAnswer}
            />
          </div>
          
          {userAnswer.length > 0 && !isRecording && (
            <Button
              onClick={() => saveUserAnswer()}
              disabled={savingAnswer || userAnswer.length < 10}
              className="w-full max-w-lg mt-2 gradient-btn text-white"
            >
              {savingAnswer ? "Saving & Evaluating..." : "Submit Answer"}
            </Button>
          )}
        </div>

      </div>

      <div className="flex justify-between items-center mt-10 max-w-7xl">
        <Button 
          variant="outline" 
          disabled={activeQuestionIndex === 0}
          onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Previous Question
        </Button>
        
        {activeQuestionIndex === questions.length - 1 ? (
          <Button 
            onClick={() => navigate(`/ai-mock-interview/${id}/feedback`)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
          >
            End Interview
          </Button>
        ) : (
          <Button 
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            className="bg-white hover:bg-slate-200 text-black border-0"
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
