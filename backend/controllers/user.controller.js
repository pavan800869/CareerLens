import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";
import { Interview } from "../models/interview.model.js";
import { Job } from "../models/job.model.js";
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        let cloudResponse = null;
        if (fileUri?.content) {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "image",
                folder: "careerlens/users/profile-photos",
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
                access_mode: "public",
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse?.secure_url || undefined,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills,socials } = req.body;
        
        const file = req.file;
        const fileUri = getDataUri(file);
        let cloudResponse = null;
        if (fileUri?.content) {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw",
                allowed_formats: ["pdf", "docx"],
                access_mode: "public",
                folder: "careerlens/users/resumes"
            });
        }


        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
        if(socials) user.profile.socialLinks = socials.split(",")
      
        // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            if (file?.originalname) {
                user.profile.resumeOriginalName = file.originalname // Save the original file name
            }
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        let stats = {};
        let recentActivity = [];

        if (user.role === 'student') {
            const applications = await Application.find({ applicant: userId }).populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            }).sort({ createdAt: -1 });
            const interviews = await Interview.find({ createdBy: userId });

            const internshipsApplied = applications.length;
            const skillsAdded = user.profile?.skills?.length || 0;
            const interviewsScheduled = interviews.length;
            const offersReceived = applications.filter(app => app.status === 'accepted').length;

            recentActivity = applications.slice(0, 5).map(app => ({
                txId: app.job?.title || "Unknown Job",
                user: app.job?.company?.name || "Company",
                date: app.createdAt.toISOString().split('T')[0],
                status: app.status === 'accepted' ? 'Offer Received' : (app.status === 'pending' ? 'Pending' : 'Rejected')
            }));

            stats = {
                internshipsApplied,
                skillsAdded,
                interviewsScheduled,
                offersReceived
            };

        } else if (user.role === 'recruiter') {
            const jobs = await Job.find({ created_by: userId });
            const jobIds = jobs.map(job => job._id);
            const applications = await Application.find({ job: { $in: jobIds } }).populate('job').populate('applicant').sort({ createdAt: -1 });

            const internshipsApplied = applications.length; // Total applications received
            const skillsAdded = jobs.length; // Total jobs posted
            const interviewsScheduled = applications.filter(app => app.status === 'pending').length; // Pending review
            const offersReceived = applications.filter(app => app.status === 'accepted').length; // Offers sent

            recentActivity = applications.slice(0, 5).map(app => ({
                txId: app.applicant?.fullname || 'Candidate',
                user: app.job?.title || "Job",
                date: app.createdAt.toISOString().split('T')[0],
                status: app.status === 'accepted' ? 'Offer Received' : (app.status === 'pending' ? 'Pending' : 'Rejected')
            }));

            stats = {
                internshipsApplied,
                skillsAdded,
                interviewsScheduled,
                offersReceived
            };
        }

        return res.status(200).json({
            success: true,
            stats,
            recentActivity
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};