import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema({
  mockId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  correctAns: {
    type: String,
  },
  userAns: {
    type: String,
  },
  feedback: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);
