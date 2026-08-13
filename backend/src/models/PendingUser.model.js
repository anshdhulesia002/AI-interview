import mongoose, { Schema } from 'mongoose';

const pendingUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'candidate',
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // 10 minutes TTL auto-expire
    },
  },
  {
    timestamps: false,
  }
);

export const PendingUser = mongoose.model('PendingUser', pendingUserSchema);
