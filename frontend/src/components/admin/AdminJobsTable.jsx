import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(()=>{ 
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])
    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableCaption className="text-slate-500 text-xs">A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground text-xs font-medium">Company Name</TableHead>
                        <TableHead className="text-muted-foreground text-xs font-medium">Role</TableHead>
                        <TableHead className="text-muted-foreground text-xs font-medium">Date</TableHead>
                        <TableHead className="text-right text-muted-foreground text-xs font-medium">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job, index) => (
                            <TableRow key={index} className="border-border hover:bg-white/[0.02]">
                                <TableCell className="text-foreground text-sm">{job?.company?.name}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{job?.title}</TableCell>
                                <TableCell className="text-muted-foreground text-xs">{job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal className='text-muted-foreground hover:text-foreground transition-colors w-4 h-4' /></PopoverTrigger>
                                        <PopoverContent className="w-40 glass border-border rounded-lg p-2">
                                            <div onClick={()=> navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-full cursor-pointer text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors'>
                                                <Edit2 className='w-3.5 h-3.5' />
                                                <span className='text-sm'>Edit</span>
                                            </div>
                                            <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-full gap-2 cursor-pointer text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors mt-0.5'>
                                                <Eye className='w-3.5 h-3.5'/>
                                                <span className='text-sm'>Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>

                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable