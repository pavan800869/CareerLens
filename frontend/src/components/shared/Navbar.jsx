
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { useState } from 'react'
import { ThemeToggle } from '../ThemeToggle'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <nav className='glass-navbar sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo */}
                <Link to="/" className='flex items-center gap-1'>
                    <h1 className='text-2xl font-bold text-foreground'>Career<span className='gradient-text-purple'>Lens</span></h1>
                </Link>

                {/* Desktop Nav */}
                <div className='hidden md:flex items-center gap-8'>
                    <ul className='flex items-center gap-6'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Jobs</Link></li>
                                    <li><Link to="/dashboard" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Dashboard</Link></li>
                                </>
                            ) : (
                                user && user.role === 'student' ? (
                                    <>
                                    <li><Link to="/" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Home</Link></li>
                                    <li><Link to="/jobs" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Jobs</Link></li>
                                    <li><Link to="/browse" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Browse</Link></li>
                                    <li><Link to="/dashboard" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Dashboard</Link></li>
                                    <li><Link to='/ai-mock-interview' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>AI Interview</Link></li>
                                </>
                                ) : (
                                    <>
                                    <li><Link to="/" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Home</Link></li>
                                    <li><Link to="/jobs" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Jobs</Link></li>
                                    <li><Link to="/browse" className='text-sm text-muted-foreground hover:text-foreground transition-colors'>Browse</Link></li>
                                </>
                                )
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <ThemeToggle />
                                <Link to="/login"><Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-accent rounded-full px-5">Login</Button></Link>
                                <Link to="/signup"><Button className="gradient-btn text-white rounded-full px-5 border-0">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-4'>
                                <ThemeToggle />
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer ring-2 ring-neon-purple/30 hover:ring-neon-purple/60 transition-all">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 glass border-border rounded-xl">
                                    <div className=''>
                                        <div className='flex gap-3 items-center'>
                                            <Avatar>
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="avatar" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-semibold text-foreground'>{user?.fullname}</h4>
                                                <p className='text-xs text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col mt-4 pt-3 border-t border-border'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors'>
                                                        <User2 className='w-4 h-4' />
                                                        <Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors mt-1'>
                                                <LogOut className='w-4 h-4' />
                                                <Button onClick={logoutHandler} variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                                </Popover>
                            </div>
                        )
                    }
                </div>

                {/* Mobile menu button */}
                <button className='md:hidden text-muted-foreground' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className='md:hidden glass border-t border-border px-4 py-4'>
                    <ul className='flex flex-col gap-3'>
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li><Link to="/admin/companies" className='text-sm text-muted-foreground'>Companies</Link></li>
                                <li><Link to="/admin/jobs" className='text-sm text-muted-foreground'>Jobs</Link></li>
                                <li><Link to="/dashboard" className='text-sm text-muted-foreground'>Dashboard</Link></li>
                            </>
                        ) : user && user.role === 'student' ? (
                            <>
                                <li><Link to="/" className='text-sm text-muted-foreground'>Home</Link></li>
                                <li><Link to="/jobs" className='text-sm text-muted-foreground'>Jobs</Link></li>
                                <li><Link to="/browse" className='text-sm text-muted-foreground'>Browse</Link></li>
                                <li><Link to="/dashboard" className='text-sm text-muted-foreground'>Dashboard</Link></li>
                                <li><Link to="/ai-mock-interview" className='text-sm text-muted-foreground'>AI Interview</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" className='text-sm text-muted-foreground'>Home</Link></li>
                                <li><Link to="/jobs" className='text-sm text-muted-foreground'>Jobs</Link></li>
                                <li><Link to="/browse" className='text-sm text-muted-foreground'>Browse</Link></li>
                            </>
                        )}
                    </ul>
                    {!user ? (
                        <div className='flex gap-3 mt-4 items-center'>
                            <ThemeToggle />
                            <Link to="/login"><Button variant="outline" className="border-border text-muted-foreground rounded-full px-5">Login</Button></Link>
                            <Link to="/signup"><Button className="gradient-btn text-white rounded-full px-5 border-0">Signup</Button></Link>
                        </div>
                    ) : (
                        <div className='flex gap-3 mt-4 items-center'>
                            <ThemeToggle />
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar