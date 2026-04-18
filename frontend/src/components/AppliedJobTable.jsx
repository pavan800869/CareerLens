import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'accepted': return 'badge-green';
            case 'rejected': return 'badge-red';
            default: return 'badge-yellow';
        }
    };

    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableCaption className="text-slate-500 text-xs">Your recent job applications</TableCaption>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground text-xs font-medium">Date</TableHead>
                        <TableHead className="text-muted-foreground text-xs font-medium">Job Role</TableHead>
                        <TableHead className="text-muted-foreground text-xs font-medium">Company</TableHead>
                        <TableHead className="text-right text-muted-foreground text-xs font-medium">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-slate-500 py-8 text-sm">
                                    You haven't applied to any jobs yet
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id} className="border-border hover:bg-white/[0.02]">
                                <TableCell className="text-muted-foreground text-xs">{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="text-foreground text-sm">{appliedJob.job?.title}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <span className={`${getStatusStyle(appliedJob?.status)} text-xs px-3 py-1 rounded-full font-medium`}>
                                        {appliedJob.status?.toUpperCase()}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable