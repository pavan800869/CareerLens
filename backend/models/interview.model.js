import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  mockId: {
    type: String,
    required: true,
    unique: true,
  },
  jsonMockResp: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  jobDesc: {
    type: String,
    required: true,
  },
  jobExperience: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const Interview = mongoose.model("Interview", interviewSchema);
