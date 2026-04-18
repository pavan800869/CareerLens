import React, { useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, ExternalLink } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    return (
        <div className='fade-in px-4'>
            {/* Profile Header Card */}
            <div className='max-w-4xl mx-auto glass-card my-8 overflow-hidden'>
                {/* Banner */}
                <div className='h-28 relative' style={{background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2), rgba(6,182,212,0.1))'}}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
                </div>
                {/* Profile info */}
                <div className='px-8 pb-8 -mt-12'>
                    <div className='flex justify-between items-end'>
                        <div className='flex items-end gap-4'>
                            <Avatar className="h-24 w-24 ring-4 ring-surface border-2 border-neon-purple/30">
                                <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                            </Avatar>
                            <div className='pb-1'>
                                <h1 className='font-semibold text-xl text-foreground'>{user?.fullname}</h1>
                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
                            <Pen className='w-3.5 h-3.5 mr-1.5' /> Edit
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div className='glass-card p-4 flex items-center gap-3'>
                    <div className="w-9 h-9 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                        <Mail className='w-4 h-4 text-neon-purple' />
                    </div>
                    <div>
                        <p className='text-xs text-slate-500'>Email</p>
                        <span className='text-sm text-foreground'>{user?.email}</span>
                    </div>
                </div>
                <div className='glass-card p-4 flex items-center gap-3'>
                    <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                        <Contact className='w-4 h-4 text-neon-cyan' />
                    </div>
                    <div>
                        <p className='text-xs text-slate-500'>Phone</p>
                        <span className='text-sm text-foreground'>{user?.phoneNumber}</span>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className='max-w-4xl mx-auto glass-card p-5 mb-4'>
                <h2 className='text-sm font-medium text-foreground mb-3'>Skills</h2>
                <div className='flex items-center gap-2 flex-wrap'>
                    {
                        user?.profile?.skills?.length !== 0 
                            ? user?.profile?.skills?.map((item, index) => (
                                <span key={index} className='badge-purple text-xs px-3 py-1 rounded-full'>{item}</span>
                            )) 
                            : <span className='text-slate-500 text-sm'>No skills added yet</span>
                    }
                </div>
            </div>

            {/* Social Links */}
            <div className='max-w-4xl mx-auto glass-card p-5 mb-4'>
                <h2 className='text-sm font-medium text-foreground mb-3'>Social Links</h2>
                <div className='flex items-center gap-2 flex-wrap'>
                    {
                        user?.profile?.socialLinks?.length !== 0 
                            ? user?.profile?.socialLinks?.map((item, index) => (
                                <a key={item} href={item} target="_blank" rel="noopener noreferrer">
                                    <span className='badge-cyan text-xs px-3 py-1 rounded-full flex items-center gap-1'>
                                        <ExternalLink className='w-3 h-3' /> {new URL(item).hostname}
                                    </span>
                                </a>
                            )) 
                            : <span className='text-slate-500 text-sm'>No links added yet</span>
                    }
                </div>
            </div>

            {/* Resume */}
            <div className='max-w-4xl mx-auto glass-card p-5 mb-4'>
                <Label className="text-sm font-medium text-foreground">Resume</Label>
                <div className='mt-2'>
                    {
                        isResume 
                            ? <a target='blank' href={user?.profile?.resume} className='text-neon-purple text-sm hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> 
                            : <span className='text-slate-500 text-sm'>No resume uploaded</span>
                    }
                </div>
            </div>

            {/* Applied Jobs */}
            <div className='max-w-4xl mx-auto glass-card p-5 mb-8'>
                <h1 className='font-semibold text-base text-foreground mb-4'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile