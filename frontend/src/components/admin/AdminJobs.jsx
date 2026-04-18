import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Plus } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div className='max-w-6xl mx-auto my-10 px-4 fade-in'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='font-semibold text-xl text-foreground'>Posted Jobs</h1>
        <div className='flex items-center gap-3'>
          <Input
            className="w-64 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg text-sm"
            placeholder="Filter by name, role..."
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")} className="gradient-btn text-white border-0 rounded-lg text-sm">
            <Plus className='w-4 h-4 mr-1.5' /> New Job
          </Button>
        </div>
      </div>
      <div className='glass-card p-4'>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs