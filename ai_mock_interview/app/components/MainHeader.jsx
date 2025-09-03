"use client"
import React from 'react';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

function MainHeader() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className='flex p-4 items-center justify-between bg-white shadow-sm border-b'>
      <div>
        <Link href="/" className='text-2xl font-bold'>
          Career<span className='text-[#F83002]'>Lens</span>
        </Link>
      </div>
      
      <nav className='hidden md:flex gap-6 items-center'>
        <Link href="/" className='hover:text-primary hover:font-bold transition-all cursor-pointer'>
          Home
        </Link>
        <Link href="/about" className='hover:text-primary hover:font-bold transition-all cursor-pointer'>
          About
        </Link>
        <Link href="/features" className='hover:text-primary hover:font-bold transition-all cursor-pointer'>
          Features
        </Link>
      </nav>

      <div className='flex items-center gap-4'>
        {!isLoaded ? (
          <div className='animate-pulse w-20 h-10 bg-gray-200 rounded'></div>
        ) : isSignedIn ? (
          <div className='flex items-center gap-4'>
            <Link 
              href="/dashboard" 
              className='px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-all'
            >
              Dashboard
            </Link>
            <UserButton />
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <SignInButton mode="modal">
              <button className='px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-all'>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className='px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all'>
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </header>
  );
}

export default MainHeader;
