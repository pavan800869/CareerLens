import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <div className='max-w-7xl mx-auto my-20 px-4'>
            <h1 className='text-3xl font-bold text-foreground'>
                <span className='gradient-text-purple'>Latest & Top </span>Job Openings
            </h1>
            <p className='text-muted-foreground text-sm mt-2 mb-8'>Discover the most recent opportunities matched for you</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children'>
                {
                    allJobs.length <= 0 
                        ? <span className='text-slate-500 col-span-3 text-center py-10'>No Jobs Available</span> 
                        : allJobs?.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
        </div>
    )
}

export default LatestJobs