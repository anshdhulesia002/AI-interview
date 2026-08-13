import mongoose, { Schema } from 'mongoose';

const achievementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    badgeId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'award',
    },
    category: {
      type: String,
      enum: ['interview_milestone', 'streak', 'score_master', 'speed'],
      default: 'interview_milestone',
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
