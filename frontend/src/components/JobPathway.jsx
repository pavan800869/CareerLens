import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AI_API_END_POINT } from '@/utils/constant';

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
        
        // Use parsed data if available, otherwise parse from text
        let parsedData = payload.pathParsed || null;
        if (!parsedData) {
          const responseData = payload.pathStr || payload.pathJson?.text || '';
          try {
            // Attempt to parse as JSON if it looks like JSON
            if (responseData.trim().startsWith('{') || responseData.includes('"')) {
              const cleaned = responseData.replace(/^```json\n?/i, '').replace(/```$/i, '').trim();
              parsedData = JSON.parse(cleaned);
            } else {
              // Otherwise try to parse the markdown-style format
              parsedData = parsePathwayFromText(responseData);
            }
          } catch (e) {
            // If JSON parsing fails, try text parsing
            parsedData = parsePathwayFromText(responseData);
          }
        }

        setPathwayData(parsedData);
        setJobTitle(payload?.job?.title || '');
        setCertifications(payload?.certifications || []);
      } catch (err) {
        setError(err.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCareerPathway();
  }, [jobId]);

  const parsePathwayFromText = (text) => {
    const timeframeRegex = /(\d+-\d+\s*(?:Months?|Years?)|2\+\s*Years?)/gi;
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

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <div className="animate-pulse">Loading career pathway...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Error: {error}</p>
      </div>
    );
  }

  const timeframes = pathwayData ? Object.keys(pathwayData) : [];
  const defaultTimeframes = ['0-3 Months', '3-6 Months', '6-12 Months', '1-2 Years', '2+ Years'];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {jobTitle && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Career Pathway for {jobTitle}</h1>
        </div>
      )}

      {pathwayData && timeframes.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {defaultTimeframes.map((timeframe, index) => {
            const data = pathwayData[timeframe];
            if (!data) return null;

            const skills = Array.isArray(data.Skills) ? data.Skills : (data.skills || []);
            const tasks = Array.isArray(data.Tasks) ? data.Tasks : (data.tasks || []);
            const tips = Array.isArray(data.Tips) ? data.Tips : (data.tips || []);

  return (
              <div key={timeframe} className="relative">
                {/* Timeline line */}
                {index < defaultTimeframes.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-blue-300"></div>
                )}
                
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                  {/* Timeframe Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {index + 1}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{timeframe}</h2>
                  </div>

                  {/* Skills Section */}
                  {skills.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">🎯</span> Skills to Develop
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-6">
                        {skills.map((skill, i) => (
                          <li key={i} className="text-gray-600">{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tasks Section */}
                  {tasks.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">📋</span> Tasks & Projects
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-6">
                        {tasks.map((task, i) => (
                          <li key={i} className="text-gray-600">{task}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tips Section */}
                  {tips.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">💡</span> Tips for Success
                      </h3>
                      <ul className="list-disc list-inside space-y-1 ml-6">
                        {tips.map((tip, i) => (
                          <li key={i} className="text-gray-600 italic">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-gray-500">Pathway data is being processed. Please check back later.</p>
        </div>
      )}

      {certifications?.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">📚 Recommended Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Learn more about ${cert.title}`}
                  className="text-blue-600 hover:underline font-semibold flex items-center"
                >
                  {cert.title}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 text-blue-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
  </div>
  );
};

export default JobPathway;
