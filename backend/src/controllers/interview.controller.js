import { Interview } from '../models/Interview.model.js';
import { Question } from '../models/Question.model.js';
import { Report } from '../models/Report.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateInterviewQuestionsWithGemini } from '../services/ai.service.js';

// 1. Generate via Google Gemini AI & Store in MongoDB
export const createInterview = asyncHandler(async (req, res) => {
  const { role, difficulty, experienceYears, durationMinutes, domain, targetCompany } = req.body;

  if (!role) {
    throw new ApiError(400, 'Target role is required');
  }

  const title = `${difficulty || 'Mid'} Level ${role} Mock Round`;

  // Create Interview Document in MongoDB linked to req.user._id
  const interview = await Interview.create({
    userId: req.user._id,
    title,
    domain: domain || 'Fullstack',
    targetCompany: targetCompany || 'General Tech',
    difficulty: difficulty || 'Mid',
    durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 45,
    status: 'scheduled',
  });

  // Call Google Gemini AI to generate structured questions (Question, Hint, Expected Answer, Difficulty)
  const aiQuestions = await generateInterviewQuestionsWithGemini({
    role,
    difficulty,
    experienceYears,
    domain,
    count: 4,
  });

  // Map and Persist Gemini Questions into MongoDB
  const questionDocs = aiQuestions.map((q) => ({
    interviewId: interview._id,
    title: q.title,
    questionText: q.questionText,
    hint: q.hint,
    expectedAnswer: q.expectedAnswer,
    sampleAnswer: q.expectedAnswer, // Alias for backwards compatibility
    difficulty: q.difficulty || difficulty || 'Medium',
    category: q.category || 'technical',
  }));

  const savedQuestions = await Question.insertMany(questionDocs);

  return res.status(201).json(
    new ApiResponse(
      201,
      { interview, questions: savedQuestions },
      'Google Gemini AI generated and stored questions in MongoDB successfully'
    )
  );
});

// 2. Get User-Isolated History (ONLY returns interviews owned by req.user._id)
export const getUserInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });

  const interviewIds = interviews.map((i) => i._id);
  const reports = await Report.find({ interviewId: { $in: interviewIds } });

  const reportsMap = {};
  reports.forEach((r) => {
    reportsMap[r.interviewId.toString()] = r;
  });

  const responseData = interviews.map((interview) => {
    const report = reportsMap[interview._id.toString()];
    return {
      id: interview._id.toString(),
      title: interview.title,
      category: interview.domain?.toLowerCase() || 'technical',
      difficulty: interview.difficulty || 'Mid',
      score: report ? report.overallScore : (interview.status === 'completed' ? 88 : 0),
      status: report ? (report.overallScore >= 80 ? 'Pass' : 'Review Needed') : (interview.status === 'completed' ? 'Pass' : 'Scheduled'),
      durationMinutes: interview.durationMinutes || 45,
      questionCount: 4,
      date: new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
  });

  return res.status(200).json(
    new ApiResponse(200, responseData, 'User isolated interview history fetched successfully')
  );
});

// 3. Get Single Interview & Seeded Questions by ID
export const getInterviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const interview = await Interview.findById(id);
  if (!interview) {
    throw new ApiError(404, 'Interview not found');
  }

  if (interview.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You do not own this interview');
  }

  const questions = await Question.find({ interviewId: id });

  return res.status(200).json(
    new ApiResponse(200, { interview, questions }, 'Interview details fetched successfully')
  );
});

// 4. Delete Interview Session from MongoDB
export const deleteInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const interview = await Interview.findById(id);
  if (!interview) {
    throw new ApiError(404, 'Interview not found');
  }

  if (interview.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You do not own this interview');
  }

  await Interview.findByIdAndDelete(id);
  await Question.deleteMany({ interviewId: id });
  await Report.deleteMany({ interviewId: id });

  return res.status(200).json(
    new ApiResponse(200, null, 'Interview session deleted successfully from MongoDB')
  );
});
