import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createInterview,
  getInterview,
  getUserInterviews,
  saveAnswer,
  getInterviewFeedback,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createInterview);
router.route("/list").get(isAuthenticated, getUserInterviews);
router.route("/:mockId").get(isAuthenticated, getInterview);
router.route("/answer").post(isAuthenticated, saveAnswer);
router.route("/:mockId/feedback").get(isAuthenticated, getInterviewFeedback);

export default router;
