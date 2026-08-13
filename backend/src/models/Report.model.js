import mongoose, { Schema } from 'mongoose';

const reportSchema = new Schema(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    breakdown: {
      technicalScore: { type: Number, default: 0 },
      behavioralScore: { type: Number, default: 0 },
      communicationScore: { type: Number, default: 0 },
      problemSolvingScore: { type: Number, default: 0 },
    },
    keyStrengths: [{
      type: String,
    }],
    areasForImprovement: [{
      type: String,
    }],
    actionableRoadmap: [{
      topic: { type: String },
      recommendation: { type: String },
    }],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model('Report', reportSchema);
