import React, { useEffect } from 'react'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div className='max-w-7xl mx-auto my-10 px-4 fade-in'>
            <div className='flex items-center gap-3 mb-8'>
                <h1 className='font-semibold text-lg text-foreground'>Search Results</h1>
                <span className='badge-purple text-xs px-3 py-1 rounded-full font-medium'>
                    {allJobs.length} Jobs
                </span>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children'>
                {
                    allJobs.map((job) => {
                        return (
                            <Job key={job._id} job={job}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Browse