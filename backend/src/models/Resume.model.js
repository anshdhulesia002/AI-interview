import mongoose, { Schema } from 'mongoose';

const resumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    parsedSkills: [{
      type: String,
    }],
    experienceYears: {
      type: Number,
      default: 0,
    },
    parsedSummary: {
      type: String,
      default: '',
    },
    rawText: {
      type: String,
      default: '',
    },
    isPrimary: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model('Resume', resumeSchema);
