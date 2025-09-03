"use client"

import { UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AddNewInterview from './_components/AddNewInterview'
import Interviewlist from './_components/Interviewlist'

function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className='font-bold text-2xl'>Dashboard</h2>
          <h2 className='text-gray-500 my-2 text-xl'>Create and Start AI Mockup Interview</h2>
        </div>

      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 my-8'>
        <AddNewInterview/>
      </div>
      {/* Previous Interview list */}
      <Interviewlist/>
    </div>
  )
}

export default Dashboard