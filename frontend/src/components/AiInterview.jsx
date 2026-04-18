import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bot, Mic, BarChart3, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import AddNewInterview from './interview/AddNewInterview';
import InterviewList from './interview/InterviewList';

const AiInterview = () => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  return (
    <div className='fade-in'>
      {/* Hero Section */}
      <div className='relative overflow-hidden py-16 px-4'>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-neon-purple/15 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[100px]"></div>
        </div>

        <div className='max-w-4xl mx-auto text-center'>
          <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-neon-purple" />
          </div>
          <h1 className='text-4xl font-bold text-foreground mb-3'>
            AI Mock <span className='gradient-text-purple'>Interview</span>
          </h1>
          <p className='text-muted-foreground text-base max-w-2xl mx-auto mb-8'>
            Practice with AI-powered mock interviews. Get personalized questions based on your job role, 
            instant feedback on your answers, and boost your confidence for real interviews.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className='max-w-5xl mx-auto px-4 mb-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {[
            { icon: <Sparkles className="w-5 h-5 text-neon-purple" />, title: "AI-Powered Questions", desc: "Get personalized questions based on your job role and experience level." },
            { icon: <Mic className="w-5 h-5 text-neon-cyan" />, title: "Voice Recording", desc: "Record your answers using your microphone for a realistic interview experience." },
            { icon: <BarChart3 className="w-5 h-5 text-emerald-400" />, title: "Instant Feedback", desc: "Receive detailed ratings and improvement suggestions for each answer." },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-6 card-hover">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Native Interview Dashboard */}
      <div className='max-w-6xl mx-auto px-4 mb-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <AddNewInterview />
        </div>
        
        <InterviewList />
      </div>
    </div>
  );
};

export default AiInterview;
