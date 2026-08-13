import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['technical', 'system_design', 'behavioral', 'coding'],
      default: 'technical',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Staff', 'Junior', 'Mid', 'Senior'],
      default: 'Medium',
    },
    questionText: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      default: '',
    },
    expectedAnswer: {
      type: String,
      default: '',
    },
    sampleAnswer: {
      type: String,
      default: '',
    },
    candidateAnswer: {
      type: String,
      default: '',
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    evaluation: {
      score: { type: Number, min: 0, max: 100, default: null },
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      timeComplexity: { type: String, default: '' },
      spaceComplexity: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model('Question', questionSchema);
