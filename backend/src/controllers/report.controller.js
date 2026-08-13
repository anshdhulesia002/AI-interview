import mongoose from 'mongoose';
import { Report } from '../models/Report.model.js';
import { Interview } from '../models/Interview.model.js';
import { Question } from '../models/Question.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { evaluateInterviewWithGemini } from '../services/ai.service.js';

// 1. Evaluate Session with Gemini AI & Store Report + Interview Document in MongoDB
export const generateReport = asyncHandler(async (req, res) => {
  const { interviewId, candidateAnswers } = req.body;

  let interview = null;
  if (interviewId && mongoose.Types.ObjectId.isValid(interviewId)) {
    interview = await Interview.findById(interviewId);
  }

  // If no existing interview, create an Interview Document in MongoDB for req.user._id
  if (!interview) {
    interview = await Interview.create({
      userId: req.user._id,
      title: 'Senior Technical Practice Round',
      domain: 'Technical',
      difficulty: 'Senior',
      durationMinutes: 45,
      status: 'completed',
    });
  } else {
    interview.status = 'completed';
    await interview.save();
  }

  const interviewTitle = interview.title || 'Senior Technical Practice Round';

  // Gather questions & actual candidate answers (No fake positive fallbacks)
  let questionsAndAnswers = [];
  if (interviewId && mongoose.Types.ObjectId.isValid(interviewId)) {
    const questions = await Question.find({ interviewId: interview._id });
    if (questions.length > 0) {
      questionsAndAnswers = questions.map((q, idx) => {
        const rawAns = (
          candidateAnswers?.[q._id] ||
          candidateAnswers?.[q.id] ||
          candidateAnswers?.[idx + 1] ||
          candidateAnswers?.[`q${idx + 1}`] ||
          ''
        ).toString().trim();

        return {
          question: q.questionText,
          expectedAnswer: q.expectedAnswer,
          candidateAnswer: rawAns || 'No response provided by candidate.',
        };
      });
    }
  }

  if (questionsAndAnswers.length === 0 && candidateAnswers && typeof candidateAnswers === 'object') {
    questionsAndAnswers = Object.entries(candidateAnswers).map(([key, val]) => ({
      question: `Question ${key}`,
      candidateAnswer: (val || '').toString().trim() || 'No response provided by candidate.',
    }));
  }

  if (questionsAndAnswers.length === 0) {
    questionsAndAnswers = [
      {
        question: 'Technical Core Concepts & System Architecture',
        candidateAnswer: 'No response provided by candidate.',
      },
    ];
  }

  // Call Gemini AI dynamic evaluation engine
  const aiReport = await evaluateInterviewWithGemini({
    interviewTitle,
    questionsAndAnswers,
  });

  // Persist Report Document in MongoDB linked to interview._id and req.user._id
  const report = await Report.create({
    interviewId: interview._id,
    userId: req.user._id,
    overallScore: typeof aiReport.overallScore === 'number' ? aiReport.overallScore : 0,
    breakdown: aiReport.breakdown || {
      technicalScore: 0,
      behavioralScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
    },
    keyStrengths: aiReport.keyStrengths || [],
    areasForImprovement: aiReport.areasForImprovement || [],
    actionableRoadmap: aiReport.actionableRoadmap || [],
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      { report, interview },
      'Interview evaluation report generated and stored in MongoDB successfully'
    )
  );
});

// 2. Get Report by Interview ID from MongoDB
export const getReportByInterviewId = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;

  let report = null;
  if (interviewId && mongoose.Types.ObjectId.isValid(interviewId)) {
    report = await Report.findOne({ interviewId });
  }

  if (!report) {
    // Return latest user report
    report = await Report.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  }

  if (!report) {
    throw new ApiError(404, 'Report not found for this interview');
  }

  return res.status(200).json(
    new ApiResponse(200, report, 'Interview report fetched successfully')
  );
});
