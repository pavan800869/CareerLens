import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AI_API_END_POINT } from '@/utils/constant';
import { Target, ClipboardList, Lightbulb, Award, ExternalLink } from 'lucide-react';

const JobPathway = () => {
  const { id: jobId } = useParams();
  const [pathwayData, setPathwayData] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareerPathway = async () => {
      try {
        const response = await axios.get(`${AI_API_END_POINT}/jobs/${jobId}/pathway`);
        const payload = response?.data?.pathway || {};
        
        let parsedData = payload.pathParsed || null;
        if (!parsedData) {
          const responseData = payload.pathStr || payload.pathJson?.text || '';
          
          try {
            if (responseData.trim().startsWith('{') || responseData.includes('"')) {
              const cleaned = responseData.replace(/^```json\n?/i, '').replace(/```$/i, '').trim();
              parsedData = JSON.parse(cleaned);
            } else {
              parsedData = parsePathwayFromText(responseData);
            }
          } catch (e) {
            console.error('Parsing error:', e);
            parsedData = parsePathwayFromText(responseData);
          }
        }

        setPathwayData(parsedData);
        setJobTitle(payload?.job?.title || '');
        setCertifications(payload?.certifications || []);
      } catch (err) {
        console.error('Error fetching pathway:', err);
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCareerPathway();
  }, [jobId]);

  const parsePathwayFromText = (text) => {
    const timeframes = ['0-3 Months', '3-6 Months', '6-12 Months', '1-2 Years', '2+ Years'];
    const result = {};

    timeframes.forEach(timeframe => {
      const sectionRegex = new RegExp(`${timeframe.replace(/[+()]/g, '\\$&')}[\\s\\S]*?(?=${timeframes.find(t => t !== timeframe)?.replace(/[+()]/g, '\\$&')}|$)`, 'i');
      const match = text.match(sectionRegex);
      if (match) {
        const section = match[0];
        const skillsMatch = section.match(/skills?[:\-]?\s*\[?([^\]]+)\]?/i);
        const tasksMatch = section.match(/tasks?[:\-]?\s*\[?([^\]]+)\]?/i);
        const tipsMatch = section.match(/tips?[:\-]?\s*\[?([^\]]+)\]?/i);

        result[timeframe] = {
          Skills: skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [],
          Tasks: tasksMatch ? tasksMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [],
          Tips: tipsMatch ? tipsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : []
        };
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  };

  const stepColors = [
    { bg: 'bg-neon-purple/10', border: 'border-neon-purple/30', text: 'text-neon-purple', ring: 'ring-neon-purple/20' },
    { bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30', text: 'text-neon-cyan', ring: 'ring-neon-cyan/20' },
    { bg: 'bg-neon-indigo/10', border: 'border-neon-indigo/30', text: 'text-neon-indigo', ring: 'ring-neon-indigo/20' },
    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
    { bg: 'bg-neon-orange/10', border: 'border-neon-orange/30', text: 'text-neon-orange', ring: 'ring-neon-orange/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm animate-pulse">Generating your career pathway...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 max-w-md text-center">
          <p className="text-red-400 text-sm">Error: {error}</p>
        </div>
      </div>
    );
  }

  const defaultTimeframes = ['0-3 Months', '3-6 Months', '6-12 Months', '1-2 Years', '2+ Years'];
  const timeframes = pathwayData ? Object.keys(pathwayData) : [];

  return (
    <div className="min-h-screen py-10 px-4 fade-in">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/8 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      {jobTitle && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="badge-purple text-xs px-3 py-1 rounded-full mb-4 inline-block">AI-Generated Pathway</span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-3">
            Career Pathway for <span className="gradient-text-purple">{jobTitle}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-3">Follow this roadmap to build the skills and experience needed for this role</p>
        </div>
      )}

      {/* Timeline */}
      {pathwayData && timeframes.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          {defaultTimeframes.map((timeframe, index) => {
            const data = pathwayData[timeframe];
            if (!data) return null;

            const skills = Array.isArray(data.Skills) ? data.Skills : (data.skills || []);
            const tasks = Array.isArray(data.Tasks) ? data.Tasks : (data.tasks || []);
            const tips = Array.isArray(data.Tips) ? data.Tips : (data.tips || []);
            const color = stepColors[index % stepColors.length];

            return (
              <div key={timeframe} className="relative mb-6">
                {/* Timeline connector */}
                {index < defaultTimeframes.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent"></div>
                )}
                
                <div className="glass-card p-6 card-hover">
                  {/* Timeframe Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center ${color.text} font-bold text-lg flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{timeframe}</h2>
                      <p className="text-xs text-slate-500">Phase {index + 1} of your journey</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="glass-card p-4">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-neon-purple" /> Skills to Develop
                        </h3>
                        <ul className="space-y-1.5">
                          {skills.map((skill, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-neon-purple mt-1.5 flex-shrink-0"></span>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tasks */}
                    {tasks.length > 0 && (
                      <div className="glass-card p-4">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <ClipboardList className="w-3.5 h-3.5 text-neon-cyan" /> Tasks & Projects
                        </h3>
                        <ul className="space-y-1.5">
                          {tasks.map((task, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0"></span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tips */}
                    {tips.length > 0 && (
                      <div className="glass-card p-4">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Tips for Success
                        </h3>
                        <ul className="space-y-1.5">
                          {tips.map((tip, i) => (
                            <li key={i} className="text-xs text-muted-foreground italic flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <p className="text-slate-500 text-sm">Pathway data is being processed. Please check back later.</p>
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12 glass-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-neon-orange" />
            Recommended Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certifications.map((cert, index) => (
              <a
                key={index}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 card-hover flex items-center justify-between group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-neon-purple transition-colors">{cert.title}</span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-neon-purple transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPathway;
