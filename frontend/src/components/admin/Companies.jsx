import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import CompaniesTable from './CompaniesTable'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Plus } from 'lucide-react'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);

    return (
        <div className='max-w-6xl mx-auto my-10 px-4 fade-in'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='font-semibold text-xl text-foreground'>Registered Companies</h1>
                <div className='flex items-center gap-3'>
                    <Input
                        className="w-64 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg text-sm"
                        placeholder="Search company..."
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={() => navigate("/admin/companies/create")} className="gradient-btn text-white border-0 rounded-lg text-sm">
                        <Plus className='w-4 h-4 mr-1.5' /> New Company
                    </Button>
                </div>
            </div>
            <div className='glass-card p-4'>
                <CompaniesTable />
            </div>
        </div>
    )
}

export default Companies