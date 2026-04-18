import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Company } from './models/company.model.js';
import { Job } from './models/job.model.js';
import { Application } from './models/application.model.js';
import { Interview } from './models/interview.model.js';
import { UserAnswer } from './models/userAnswer.model.js';

dotenv.config();

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        // Clear all collections except Users
        await Company.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        await Interview.deleteMany({});
        await UserAnswer.deleteMany({});

        console.log('All fake data (Companies, Jobs, Applications, Interviews) cleared successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

clearData();
