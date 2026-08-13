import mongoose, { Schema } from 'mongoose';

const analyticsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalInterviews: {
      type: Number,
      default: 0,
    },
    totalCompleted: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    readinessIndex: {
      type: Number,
      default: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    weeklyActivity: [
      {
        date: { type: String },
        count: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Analytics = mongoose.model('Analytics', analyticsSchema);
