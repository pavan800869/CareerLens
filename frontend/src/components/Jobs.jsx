import React, { useEffect, useState } from 'react'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='max-w-7xl mx-auto mt-8 px-4 fade-in'>
            <div className='flex gap-6'>
                <div className='w-[280px] hidden md:block flex-shrink-0'>
                    <FilterCard />
                </div>
                {
                    filterJobs.length <= 0 ? (
                        <div className='flex-1 flex items-center justify-center py-20'>
                            <span className='text-slate-500'>No jobs found</span>
                        </div>
                    ) : (
                        <div className='flex-1 h-[88vh] overflow-y-auto pb-5 scrollbar-thin scrollbar-thumb-white/10'>
                            <div className='flex items-center gap-3 mb-5'>
                                <h2 className='text-foreground font-medium text-sm'>All Jobs</h2>
                                <span className='badge-purple text-xs px-3 py-1 rounded-full font-medium'>{filterJobs.length}</span>
                            </div>
                            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                                {
                                    filterJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}>
                                            <Job job={job} />
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Jobs