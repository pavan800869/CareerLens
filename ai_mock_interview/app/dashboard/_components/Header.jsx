"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Image from 'next/image'

function Header() {
    const path = usePathname();
    const router = useRouter()
    
    useEffect(()=>{
        console.log(path)
    },[])
    
    function getRoutLink(path){
       router.push(path)
    }

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <div>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
        </div>
      <ul className='hidden md:flex gap-6'>
        <li onClick={()=>getRoutLink('/dashboard')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard'&&'text-primary font-bold'}`}>Overview</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/questions'&&'text-primary font-bold'}`}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/upgrade'&&'text-primary font-bold'}`}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/how'&&'text-primary font-bold'}`}>How it works?</li>
      </ul>
    </div>
  )
}

export default Header