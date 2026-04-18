import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { response } from "./response";
import { MapPin, Briefcase, DollarSign, Users, Clock, Sparkles } from 'lucide-react';

const JobDescription = () => {
    const navigate = useNavigate();
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            if(res.data.success){
                setIsApplied(true);
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    useEffect(() => {
      setSingleJob(response);
    }, [])

    return (
        <div className='fade-in'>
            <div className='max-w-7xl mx-auto my-10 px-4'>
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-card p-6 mb-8">
                    <div>
                        <h1 className="font-bold text-2xl text-foreground">{singleJob?.title}</h1>
                        <p className="text-slate-500 text-sm mt-1">Posted on: {singleJob?.createdAt?.split("T")[0]}</p>
                        <div className="flex items-center gap-3 mt-4 flex-wrap">
                            <span className="badge-cyan text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                                <Users className='w-3 h-3' /> {singleJob?.postion} Positions
                            </span>
                            <span className="badge-orange text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                                <Briefcase className='w-3 h-3' /> {singleJob?.jobType}
                            </span>
                            <span className="badge-purple text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                                <DollarSign className='w-3 h-3' /> {singleJob?.salary} LPA
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-lg px-8 py-5 text-sm font-medium ${
                            isApplied 
                                ? 'bg-slate-700 text-muted-foreground cursor-not-allowed border-0' 
                                : 'gradient-btn text-white border-0'
                        }`}
                    >
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                {/* Info grid */}
                <h2 className='text-foreground font-semibold text-lg mb-4 flex items-center gap-2'>
                    <span className='w-1 h-5 bg-neon-purple rounded-full'></span>
                    Job Description
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                        { icon: <Briefcase className='w-4 h-4 text-neon-purple' />, label: 'Role', value: singleJob?.title },
                        { icon: <MapPin className='w-4 h-4 text-neon-cyan' />, label: 'Location', value: singleJob?.location },
                        { icon: <Clock className='w-4 h-4 text-neon-orange' />, label: 'Experience', value: `${singleJob?.experienceLevel != null ? singleJob?.experienceLevel : 'N.A.'} yrs` },
                        { icon: <DollarSign className='w-4 h-4 text-emerald-400' />, label: 'Salary', value: `${singleJob?.salary} LPA` },
                        { icon: <Users className='w-4 h-4 text-amber-400' />, label: 'Total Applicants', value: singleJob?.applications?.length },
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-4 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mt-0.5">{item.icon}</div>
                            <div>
                                <h3 className="text-xs text-slate-500 font-medium">{item.label}</h3>
                                <p className="text-sm text-foreground mt-0.5">{item.value}</p>
                            </div>
                        </div>
                    ))}
                    <div className="glass-card p-4 sm:col-span-2">
                        <h3 className="text-xs text-slate-500 font-medium mb-1">Description</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{singleJob?.description}</p>
                    </div>
                </div>

                {/* Explore Pathway CTA */}
                <button
                    type="button"
                    onClick={() => navigate(`/pathway/${singleJob?._id}`)}
                    className="gradient-btn text-white px-8 py-3 rounded-lg font-medium text-sm flex items-center gap-2"
                >
                    <Sparkles className='w-4 h-4' /> Explore Career Pathway
                </button>
            </div>
        </div>
    )
}

export default JobDescription