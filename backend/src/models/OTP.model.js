import mongoose, { Schema } from 'mongoose';

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
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

export const OTP = mongoose.model('OTP', otpSchema);
