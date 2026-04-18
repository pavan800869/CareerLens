const truncateText = (text, maxLength) => {
  if (!text) return '';
  const textStr = typeof text === 'string' ? text : String(text);
  if (textStr.length <= maxLength) return textStr;
  return `${textStr.slice(0, maxLength)}...`;
};

// Helper function to safely convert values to strings
const safeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    // If it's an array, join it
    if (Array.isArray(value)) return value.join(', ');
    // If it's an object, stringify it or extract meaningful text
    if (value.constructor === Object) {
      if (value.description) return String(value.description);
      if (value.summary) return String(value.summary);
      if (value.value) return String(value.value);
      return JSON.stringify(value);
    }
    return String(value);
  }
  return defaultValue;
};

const ApplicantCard = ({ applicant, insights, rankingScore, onViewProfile }) => {
  const { fullname, email, skills = [] } = applicant || {};
  const { relevanceScore = 0, professionalBrand = {}, summary = '', sentiment = 'neutral', skillMatch = [], missingSkills = [] } = insights || {};
  const { score = 0, explanation = '', social_profile_insights_details = {} } = rankingScore || {};
  const { strengths = '', onlineEngagement = '', developmentAreas = '' } = professionalBrand || {};
  
  const safeStrengths = safeString(strengths);
  const safeEngagement = safeString(onlineEngagement);
  const safeDevelopment = safeString(developmentAreas);
  const safeSummary = safeString(summary);
  const safeExplanation = safeString(explanation);
  
  const social = {
    github: safeString(social_profile_insights_details.github),
    linkedin: safeString(social_profile_insights_details.linkedin),
    portfolio: safeString(social_profile_insights_details.portfolio)
  };

  const getSentimentStyle = (s) => {
    switch(String(s).toLowerCase()) {
      case 'positive': return 'badge-green';
      case 'negative': return 'badge-red';
      default: return 'badge-yellow';
    }
  };

  const scoreColor = Number(relevanceScore) >= 70 ? 'text-emerald-400' : Number(relevanceScore) >= 40 ? 'text-amber-400' : 'text-red-400';
  const scoreBorderColor = Number(relevanceScore) >= 70 ? 'border-emerald-500/30' : Number(relevanceScore) >= 40 ? 'border-amber-500/30' : 'border-red-500/30';

  return (
    <div className="glass-card p-6 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple font-semibold text-sm">
            {safeString(fullname, '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{safeString(fullname, 'Unknown')}</h2>
            <p className="text-xs text-slate-500">{safeString(email, 'N/A')}</p>
          </div>
        </div>
        <span className={`${getSentimentStyle(sentiment)} text-xs px-3 py-1 rounded-full font-medium`}>
          {safeString(sentiment, 'neutral')}
        </span>
      </div>

      {/* Skills */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Key Skills</h3>
        <div className="flex flex-wrap gap-1.5">
          {Array.isArray(skills) && skills.length > 0 ? (
            skills.map((skill, index) => (
              <span key={index} className="badge-cyan text-xs px-2 py-0.5 rounded-full">
                {safeString(skill)}
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-xs">No skills listed</span>
          )}
        </div>
        {Array.isArray(skillMatch) && skillMatch.length > 0 && (
          <>
            <h4 className="text-xs font-medium text-muted-foreground mt-3 mb-1.5">Matched Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {skillMatch.map((skill, index) => (
                <span key={index} className="badge-green text-xs px-2 py-0.5 rounded-full">
                  {safeString(skill)}
                </span>
              ))}
            </div>
          </>
        )}
        {Array.isArray(missingSkills) && missingSkills.length > 0 && (
          <>
            <h4 className="text-xs font-medium text-muted-foreground mt-3 mb-1.5">Missing Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill, index) => (
                <span key={index} className="badge-yellow text-xs px-2 py-0.5 rounded-full">
                  {safeString(skill)}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Professional Brand + Score */}
      <div className="glass-card p-4 mb-4">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Professional Brand</h3>
            <p className="text-muted-foreground text-xs mt-1">
              <span className="text-slate-500">Strengths:</span> {truncateText(safeStrengths, 50)}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              <span className="text-slate-500">Engagement:</span> {truncateText(safeEngagement, 50)}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              <span className="text-slate-500">Dev Areas:</span> {truncateText(safeDevelopment, 50)}
            </p>
          </div>

          {/* Relevance Score Circle */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 mb-2">Relevance</span>
            <div className={`relative w-20 h-20 rounded-full border-4 ${scoreBorderColor} flex items-center justify-center bg-accent`}>
              <span className={`text-lg font-bold ${scoreColor}`}>
                {Number(relevanceScore) || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Profiles */}
      <div className="glass-card p-4 mb-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Social Profiles</h3>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground"><span className="text-slate-500">GitHub:</span> {social.github || 'N/A'}</p>
          <p className="text-xs text-muted-foreground"><span className="text-slate-500">LinkedIn:</span> {social.linkedin || 'N/A'}</p>
          <p className="text-xs text-muted-foreground"><span className="text-slate-500">Portfolio:</span> {social.portfolio || 'N/A'}</p>
        </div>
      </div>

      {/* Overall Score */}
      {score > 0 && (
        <div className="glass-card p-4 mb-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Overall Score: <span className="text-neon-purple text-sm">{Number(score) || 0}%</span></h3>
          {safeExplanation && (
            <p className="text-muted-foreground text-xs mt-1">{truncateText(safeExplanation, 200)}</p>
          )}
        </div>
      )}

      {/* Summary + Contact */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Summary</h3>
        <p className="text-muted-foreground text-xs">{truncateText(safeSummary, 100)}</p>

        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
          <p className="text-xs text-slate-500">{safeString(email, 'N/A')}</p>
          {onViewProfile && (
            <button 
              onClick={onViewProfile}
              className="gradient-btn text-white text-xs font-medium px-4 py-2 rounded-lg"
            >
              View Full Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
