import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
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
        <div className='min-h-[80vh] flex items-center justify-center px-4'>
            {/* Background effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-neon-purple/15 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-neon-indigo/10 rounded-full blur-[100px]"></div>
            </div>

            <div className='w-full max-w-md'>
                <div className='glass-card p-8 fade-in'>
                    <div className='text-center mb-8'>
                        <h1 className='font-bold text-2xl text-foreground'>Welcome Back</h1>
                        <p className='text-muted-foreground text-sm mt-1'>Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-5'>
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

                        {loading ? (
                            <Button className="w-full gradient-btn text-white border-0 rounded-lg py-5" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full gradient-btn text-white border-0 rounded-lg py-5">
                                Login
                            </Button>
                        )}

                        <p className='text-center text-sm text-muted-foreground'>
                            Don't have an account?{' '}
                            <Link to="/signup" className='text-neon-purple hover:text-neon-purple/80 font-medium'>Signup</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login