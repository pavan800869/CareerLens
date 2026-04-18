import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const truncateDescription = (text, maxWords) => {
        const words = text.split(' ');
        return words.length > maxWords ? `${words.slice(0, maxWords).join(' ')}...` : text;
    };

    return (
        <div className="glass-card p-5 h-full flex flex-col justify-between card-hover">
            {/* Top row */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                <button className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-neon-purple hover:border-neon-purple/30 transition-all">
                    <Bookmark className='w-3.5 h-3.5' />
                </button>
            </div>

            {/* Company info */}
            <div className="flex items-center gap-3 my-4">
                <div className="w-10 h-10 rounded-lg bg-accent border border-border flex items-center justify-center overflow-hidden">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </div>
                <div>
                    <h2 className="font-medium text-sm text-foreground">{job?.company?.name}</h2>
                    <p className="text-xs text-slate-500">India</p>
                </div>
            </div>

            {/* Job details */}
            <div>
                <h1 className="font-semibold text-base text-foreground mb-2">{job?.title}</h1>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {truncateDescription(job?.description || '', 25)}
                </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="badge-cyan text-xs px-2.5 py-1 rounded-full font-medium">
                    {job?.position} Positions
                </span>
                <span className="badge-orange text-xs px-2.5 py-1 rounded-full font-medium">
                    {job?.jobType}
                </span>
                <span className="badge-purple text-xs px-2.5 py-1 rounded-full font-medium">
                    {job?.salary}LPA
                </span>
                <span className="text-neon-cyan bg-neon-cyan/10 text-xs px-2.5 py-1 rounded-full font-medium">
                    {job?.experienceLevel} Yrs Exp
                </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-5">
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="flex-1 text-xs border-border text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                >
                    Details
                </Button>
                <Button className="flex-1 text-xs gradient-btn text-white rounded-lg border-0">
                    Save For Later
                </Button>
            </div>
        </div>
    );
};

export default Job;
