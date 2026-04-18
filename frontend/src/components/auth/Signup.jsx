import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, Camera } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-4 py-10'>
            {/* Background effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-neon-purple/15 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[100px]"></div>
            </div>

            <div className='w-full max-w-lg'>
                <div className='glass-card p-8 fade-in'>
                    <div className='text-center mb-8'>
                        <h1 className='font-bold text-2xl text-foreground'>Create Account</h1>
                        <p className='text-muted-foreground text-sm mt-1'>Start your journey with CareerLens</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <Label className="text-muted-foreground text-sm">Full Name</Label>
                                <Input
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    placeholder="John Doe"
                                    className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg"
                                />
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm">Email</Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="you@example.com"
                                    className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg"
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <Label className="text-muted-foreground text-sm">Phone Number</Label>
                                <Input
                                    type="text"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    placeholder="9876543210"
                                    className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg"
                                />
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm">Password</Label>
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="••••••••"
                                    className="mt-1.5 bg-accent border-border text-foreground placeholder:text-slate-500 input-glow rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Role selector */}
                        <div>
                            <Label className="text-muted-foreground text-sm mb-3 block">I am a</Label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setInput({...input, role: 'student'})}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        input.role === 'student' 
                                            ? 'gradient-btn text-white shadow-lg' 
                                            : 'bg-accent border border-border text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInput({...input, role: 'recruiter'})}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        input.role === 'recruiter' 
                                            ? 'gradient-btn text-white shadow-lg' 
                                            : 'bg-accent border border-border text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Recruiter
                                </button>
                            </div>
                        </div>

                        {/* Profile photo */}
                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Profile Photo</Label>
                            <label className="flex items-center gap-3 p-3 rounded-lg bg-accent border border-border border-dashed cursor-pointer hover:border-neon-purple/30 transition-all">
                                <div className="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center">
                                    <Camera className="w-4 h-4 text-neon-purple" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{input.file ? input.file.name : 'Choose a photo'}</p>
                                    <p className="text-xs text-slate-500">JPG, PNG up to 2MB</p>
                                </div>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {loading ? (
                            <Button className="w-full gradient-btn text-white border-0 rounded-lg py-5" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full gradient-btn text-white border-0 rounded-lg py-5">
                                Create Account
                            </Button>
                        )}

                        <p className='text-center text-sm text-muted-foreground'>
                            Already have an account?{' '}
                            <Link to="/login" className='text-neon-purple hover:text-neon-purple/80 font-medium'>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup