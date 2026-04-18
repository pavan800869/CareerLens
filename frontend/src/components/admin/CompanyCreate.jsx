import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { ArrowLeft } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();
    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='max-w-4xl mx-auto my-10 px-4 fade-in'>
            <div className='mb-8'>
                <h1 className='font-bold text-2xl text-foreground'>Your Company Name</h1>
                <p className='text-muted-foreground text-sm mt-1'>What would you like to give your company name? You can change this later.</p>
            </div>

            <div className='glass-card p-6'>
                <Label className="text-muted-foreground text-sm">Company Name</Label>
                <Input
                    type="text"
                    className="mt-2 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg"
                    placeholder="JobHunt, Microsoft etc."
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className='flex items-center gap-3 mt-6'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")} className="border-border text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
                        <ArrowLeft className='w-3.5 h-3.5 mr-1.5' /> Cancel
                    </Button>
                    <Button onClick={registerNewCompany} className="gradient-btn text-white border-0 rounded-lg">Continue</Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate