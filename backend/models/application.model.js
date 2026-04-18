import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    },
    // Cache for AI-generated insights
    aiInsights: {
        type: String,
        default: null
    },
    aiRankingScore: {
        type: String,
        default: null
    },
    aiInsightsGeneratedAt: {
        type: Date,
        default: null
    }
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);