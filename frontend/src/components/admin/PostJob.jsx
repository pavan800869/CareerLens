import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        setInput({...input, companyId:selectedCompany._id});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className='fade-in'>
            <div className='flex items-center justify-center w-full my-8 px-4'>
                <form onSubmit={submitHandler} className='glass-card p-8 w-full max-w-4xl'>
                    <h1 className='text-xl font-semibold text-foreground mb-6'>Post New Job</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label className="text-muted-foreground text-sm">Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">Requirements</Label>
                            <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">Salary</Label>
                            <Input type="text" name="salary" value={input.salary} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">Job Type</Label>
                            <Input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">Experience Level</Label>
                            <Input type="text" name="experience" value={input.experience} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm">No of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler}
                                className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg" />
                        </div>
                        {
                            companies.length > 0 && (
                                <div className='md:col-span-2'>
                                    <Label className="text-muted-foreground text-sm mb-1.5 block">Select Company</Label>
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="bg-accent border-border text-foreground rounded-lg">
                                            <SelectValue placeholder="Select a Company" />
                                        </SelectTrigger>
                                        <SelectContent className="glass border-border rounded-lg">
                                            <SelectGroup>
                                                {companies.map((company) => (
                                                    <SelectItem key={company._id} value={company?.name?.toLowerCase()} className="text-muted-foreground hover:text-foreground">{company.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                    <div className='mt-6'>
                        {loading ? (
                            <Button className="w-full gradient-btn text-white border-0 rounded-lg py-5" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full gradient-btn text-white border-0 rounded-lg py-5">Post New Job</Button>
                        )}
                    </div>
                    {companies.length === 0 && (
                        <p className='text-xs text-red-400 text-center mt-3'>*Please register a company first before posting jobs</p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PostJob