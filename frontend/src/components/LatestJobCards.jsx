import React from 'react';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const truncateDescription = (text, maxWords) => {
        const words = text.split(' ');
        return words.length > maxWords ? `${words.slice(0, maxWords).join(' ')}...` : text;
    };

    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className="glass-card p-5 cursor-pointer card-hover"
        >
            <div>
                <h1 className="font-medium text-sm text-foreground">{job?.company?.name}</h1>
                <p className="text-xs text-slate-500">India</p>
            </div>
            <div className='mt-3'>
                <h1 className="font-semibold text-base text-foreground">{job?.title}</h1>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {truncateDescription(job?.description || '', 25)}
                </p>
            </div>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="badge-cyan text-xs px-2.5 py-1 rounded-full font-medium">{job?.position} Positions</span>
                <span className="badge-orange text-xs px-2.5 py-1 rounded-full font-medium">{job?.jobType}</span>
                <span className="badge-purple text-xs px-2.5 py-1 rounded-full font-medium">{job?.salary}LPA</span>
                <span className="text-neon-cyan bg-neon-cyan/10 text-xs px-2.5 py-1 rounded-full font-medium">{job?.experienceLevel} Yrs Exp</span>
            </div>
        </div>
    );
};

export default LatestJobCards;
