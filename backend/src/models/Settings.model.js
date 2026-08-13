import mongoose, { Schema } from 'mongoose';

const settingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'system'],
      default: 'dark',
    },
    emailNotifications: {
      interviewReminders: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    audio: {
      autoPlayVoice: { type: Boolean, default: true },
      voiceType: { type: String, default: 'natural_en_us' },
      speechSpeed: { type: Number, default: 1.0 },
    },
    codeEditor: {
      fontSize: { type: Number, default: 14 },
      keyBinding: { type: String, default: 'standard' },
      tabSize: { type: Number, default: 2 },
      autoCloseBrackets: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
