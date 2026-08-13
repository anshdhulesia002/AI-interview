import mongoose, { Schema } from 'mongoose';

const interviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'System Design', 'AI/ML', 'General'],
    },
    targetCompany: {
      type: String,
      default: 'General Tech',
    },
    difficulty: {
      type: String,
      enum: ['Junior', 'Mid', 'Senior', 'Staff'],
      default: 'Mid',
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    feedbackSummary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model('Interview', interviewSchema);
