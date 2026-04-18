import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/user.model.js';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data just in case
        await Company.deleteMany({});
        await Job.deleteMany({});
        // We will remove our specific test users to prevent unique constraint errors
        await User.deleteMany({ email: { $in: ['recruiter@tech.com', 'student@tech.com'] } });

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Create a Recruiter User
        const recruiter = await User.create({
            fullname: 'Tech Recruiter',
            email: 'recruiter@tech.com',
            phoneNumber: '9876543210',
            password: hashedPassword,
            role: 'recruiter',
            profile: {
                bio: 'Senior Technical Recruiter looking for top talent.',
                skills: ['Recruiting', 'HR', 'Tech Hiring'],
                profilePhoto: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            }
        });
        console.log('✅ Recruiter created: recruiter@tech.com (password: password123)');

        // 2. Create a Student User
        const student = await User.create({
            fullname: 'Tech Student',
            email: 'student@tech.com',
            phoneNumber: '1234567890',
            password: hashedPassword,
            role: 'student',
            profile: {
                bio: 'Passionate computer science student looking for opportunities.',
                skills: ['JavaScript', 'React', 'Node.js', 'Python'],
                profilePhoto: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png'
            }
        });
        console.log('✅ Student created: student@tech.com (password: password123)');

        // 3. Create Companies
        const google = await Company.create({
            name: 'Google',
            description: 'Google LLC is an American multinational technology company focusing on artificial intelligence, online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.',
            website: 'https://google.com',
            location: 'Mountain View, California',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
            userId: recruiter._id
        });

        const microsoft = await Company.create({
            name: 'Microsoft',
            description: 'Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.',
            website: 'https://microsoft.com',
            location: 'Redmond, Washington',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png',
            userId: recruiter._id
        });
        console.log('✅ Companies created: Google, Microsoft');

        // 4. Create Jobs for Google
        await Job.insertMany([
            {
                title: 'Senior Software Engineer',
                description: 'We are looking for an experienced Software Engineer to join our Core Search team. You will be responsible for building scalable backend systems that process billions of queries per day.',
                requirements: ['C++', 'Python', 'Distributed Systems', 'System Design', 'Algorithms'],
                salary: 45, // LPA
                experienceLevel: 5, // Yrs
                location: 'Bangalore, India',
                jobType: 'Full Time',
                position: 3,
                company: google._id,
                created_by: recruiter._id
            },
            {
                title: 'Data Scientist',
                description: 'Join our AI research division to build next-generation machine learning models for natural language processing.',
                requirements: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Machine Learning'],
                salary: 35, // LPA
                experienceLevel: 3, // Yrs
                location: 'Hyderabad, India',
                jobType: 'Full Time',
                position: 2,
                company: google._id,
                created_by: recruiter._id
            }
        ]);

        // 5. Create Jobs for Microsoft
        await Job.insertMany([
            {
                title: 'Frontend Developer',
                description: 'Help us build the next generation of web experiences for Microsoft 365. You will work closely with designers and product managers to deliver seamless user interfaces.',
                requirements: ['React', 'TypeScript', 'CSS', 'Redux', 'Web Performance'],
                salary: 25, // LPA
                experienceLevel: 2, // Yrs
                location: 'Noida, India',
                jobType: 'Full Time',
                position: 5,
                company: microsoft._id,
                created_by: recruiter._id
            },
            {
                title: 'Cloud Solutions Architect',
                description: 'Work with enterprise customers to design and architect scalable solutions on Microsoft Azure. Must have strong client-facing communication skills.',
                requirements: ['Azure', 'Cloud Computing', 'System Architecture', 'Communication'],
                salary: 40, // LPA
                experienceLevel: 6, // Yrs
                location: 'Remote',
                jobType: 'Remote',
                position: 1,
                company: microsoft._id,
                created_by: recruiter._id
            }
        ]);
        console.log('✅ Jobs created successfully!');

        console.log('🎉 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDatabase();
