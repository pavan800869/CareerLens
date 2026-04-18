import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='relative overflow-hidden'>
            {/* Background gradient mesh */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[128px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-indigo/10 rounded-full blur-[100px]"></div>
            </div>

            <div className='text-center py-28 px-4'>
                <div className='flex flex-col gap-6 max-w-4xl mx-auto fade-in'>
                    {/* Badge */}
                    <span className='mx-auto px-5 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-sm font-medium tracking-wide'>
                        ✨ Your Gateway to Top Internships
                    </span>

                    {/* Headline */}
                    <h1 className='text-5xl md:text-6xl font-bold text-foreground leading-tight'>
                        Find, Apply & Kickstart<br />Your Career with{' '}
                        <span className='gradient-text-purple'>Dream Internships</span>
                    </h1>

                    {/* Subtitle */}
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
                        Browse through a wide variety of internship opportunities and start building your career today with AI-powered insights!
                    </p>

                    {/* Search bar */}
                    <div className='flex max-w-xl mx-auto w-full mt-4'>
                        <div className='flex w-full glass rounded-full items-center px-4 gap-3 group focus-within:border-neon-purple/40 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all'>
                            <Search className='h-5 w-5 text-slate-500 group-focus-within:text-neon-purple transition-colors' />
                            <input
                                type="text"
                                placeholder='Search your dream internship...'
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchJobHandler()}
                                className='flex-1 bg-transparent outline-none border-none text-foreground placeholder:text-slate-500 py-3.5 text-sm'
                            />
                            <Button onClick={searchJobHandler} className="gradient-btn rounded-full px-6 py-2 text-foreground text-sm border-0 -mr-1">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className='flex items-center justify-center gap-6 mt-4 text-slate-500 text-xs'>
                        <span className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
                            500+ Active Listings
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full bg-neon-purple'></span>
                            AI-Powered Matching
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full bg-neon-cyan'></span>
                            Free Mock Interviews
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
