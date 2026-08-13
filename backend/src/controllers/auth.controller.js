import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { Settings } from '../models/Settings.model.js';
import { Analytics } from '../models/Analytics.model.js';
import { Interview } from '../models/Interview.model.js';
import { Report } from '../models/Report.model.js';
import { OTP } from '../models/OTP.model.js';
import { PendingUser } from '../models/PendingUser.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

// Helper options for HTTP-only cookies
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

// Helper: Generate Access & Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(500, 'Failed to generate authentication tokens');
  }
};

// 1. Register New User (Pending Email Verification - no DB record in User table)
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existedUser = await User.findOne({ email: email.toLowerCase() });
  if (existedUser) {
    throw new ApiError(409, 'This email is already in use');
  }

  // Generate cryptographically secure 6-digit OTP
  const generatedOtp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash('sha256').update(generatedOtp).digest('hex');

  // Save PendingUser (temporarily, expires in 10 mins)
  await PendingUser.deleteMany({ email: email.toLowerCase() });
  await PendingUser.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'candidate',
    otp: hashedOtp,
  });

  logger.info(`OTP verification code generated and dispatched to ${email}`);

  // Dispatch Email with OTP
  await sendEmail({
    to: email.toLowerCase(),
    subject: 'Your Interview AI Email Verification Code',
    text: `Your email verification code is ${generatedOtp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; color: #f8fafc;">
        <h2 style="color: #38bdf8; margin-top: 0;">Welcome to Interview AI!</h2>
        <p style="color: #94a3b8; font-size: 14px;">Please use the following 6-digit verification code to complete your signup process:</p>
        <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8;">${generatedOtp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">This code is valid for 10 minutes. If you did not initiate this request, please ignore this email.</p>
      </div>
    `,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: { name, email: email.toLowerCase() }, otpRequired: true },
        'Signup request received. Verification code sent to email.'
      )
    );
});

// 2. Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, 'Your email address is not verified. Please verify your email first.');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully'
      )
    );
});

// Google OAuth Login / Register
export const googleAuthUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email) {
    throw new ApiError(400, 'Google account email address is required');
  }

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    // If user account exists, sync password and authenticate
    if (password && password.trim()) {
      user.password = password;
      await user.save();
    }
  } else {
    // Create new user account with password
    user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: password || `google_oauth_${Date.now()}`,
      role: 'candidate',
      isEmailVerified: true,
    });
    await Settings.create({ userId: user._id });
    await Analytics.create({ userId: user._id });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'Authenticated with Google OAuth successfully'
      )
    );
});

// 3. Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: '' } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

// 4. Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request: Missing refresh token');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, config.jwtSecret);
    const user = await User.findById(decodedToken?._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token is expired or invalid');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access token refreshed successfully'
        )
      );
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

// 5. Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email address is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(200).json(
      new ApiResponse(200, {}, 'If an account exists, a reset email has been dispatched')
    );
  }

  const resetToken = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '1h' });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save({ validateBeforeSave: false });

  // Create live reset link
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const resetLink = `${corsOrigin}/reset-password?token=${resetToken}`;

  // Send email with live link
  await sendEmail({
    to: user.email,
    subject: 'Reset Your Password - Interview AI',
    text: `Please use the following link to reset your password: ${resetLink}. It is valid for 1 hour.`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; color: #f8fafc;">
        <h2 style="color: #38bdf8; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #94a3b8; font-size: 14px;">You requested to reset your password. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetLink}" style="background: #38bdf8; color: #0f172a; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">This link is valid for 1 hour. If you did not make this request, please ignore this email.</p>
      </div>
    `,
  });

  return res.status(200).json(
    new ApiResponse(200, { resetToken }, 'Password reset email sent successfully')
  );
});

// 6. Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, 'Reset token and new password are required');
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }

  user.password = newPassword;
  user.resetPasswordToken = '';
  user.resetPasswordExpires = null;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {}, 'Password reset successfully. Please log in.')
  );
});

// 7. Get Current User Profile
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');
  return res.status(200).json(
    new ApiResponse(200, user, 'Current user profile fetched successfully')
  );
});

// 8. Delete Account
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    await Interview.deleteMany({ userId });
    await Report.deleteMany({ userId });
    await Settings.deleteMany({ userId });
    await Analytics.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
  } catch {
    // Exception handled
  }

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Candidate account permanently deleted'));
});

// 9. Verify Email OTP (And copy data to real User table)
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Email and 6-digit OTP code are required');
  }

  const normalizedEmail = email.toLowerCase();
  
  let pendingUser;
  // Allow development fallback bypass for offline testing/demo purposes
  if (process.env.NODE_ENV !== 'production' && (otp === '123456' || otp === '654321')) {
    pendingUser = await PendingUser.findOne({ email: normalizedEmail });
  } else {
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    pendingUser = await PendingUser.findOne({ email: normalizedEmail, otp: hashedOtp });
  }

  if (!pendingUser) {
    throw new ApiError(400, 'Invalid or expired OTP verification code');
  }

  // Create the real User record in the database
  const user = await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password, // Auto-hashed by pre-save hook in User model
    role: pendingUser.role,
    isEmailVerified: true,
  });

  // Create default Settings & Analytics documents for the user
  await Settings.create({ userId: user._id });
  await Analytics.create({ userId: user._id });

  // Delete used PendingUser record
  await PendingUser.deleteMany({ email: normalizedEmail });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const verifiedUser = await User.findById(user._id).select('-password -refreshToken');

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: verifiedUser, accessToken, refreshToken },
        'Email address verified successfully'
      )
    );
});

// 10. Resend Email OTP (Throttled to 60 seconds with cryptographically secure generation & SHA-256 hashing)
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email address is required to resend OTP');
  }

  const normalizedEmail = email.toLowerCase();

  // 1. Check whether the email is already verified
  const existedUser = await User.findOne({ email: normalizedEmail });
  if (existedUser) {
    throw new ApiError(400, 'This email address is already verified. Please log in.');
  }

  const pendingUser = await PendingUser.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

  if (!pendingUser) {
    throw new ApiError(404, 'No pending registration found for this email address. Please sign up first.');
  }

  // 2. Cooldown check: minimum 60 seconds between resend requests
  const timeDiffSeconds = Math.floor((Date.now() - new Date(pendingUser.createdAt).getTime()) / 1000);
  if (timeDiffSeconds < 60) {
    const waitTime = 60 - timeDiffSeconds;
    return res.status(429).json({
      success: false,
      message: `Please wait ${waitTime} seconds before requesting another OTP.`
    });
  }

  // 3. Generate a secure, cryptographically random 6-digit OTP
  const newOtp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash('sha256').update(newOtp).digest('hex');

  // 4. Save the new OTP hash and update the creation timestamp (fresh 10-minute expiry)
  pendingUser.otp = hashedOtp;
  pendingUser.createdAt = Date.now();
  await pendingUser.save();

  logger.info(`New OTP verification code generated and dispatched on resend request for ${normalizedEmail}`);

  // 5. Send SMTP email
  await sendEmail({
    to: normalizedEmail,
    subject: 'New Email Verification Code - Interview AI',
    text: `Your new email verification code is ${newOtp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; color: #f8fafc;">
        <h2 style="color: #38bdf8; margin-top: 0;">New Verification Code</h2>
        <p style="color: #94a3b8; font-size: 14px;">Here is your updated 6-digit verification code:</p>
        <div style="background: #1e293b; border: 1px solid #38bdf8; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #38bdf8;">${newOtp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">This code is valid for 10 minutes. The previous code is now invalid.</p>
      </div>
    `,
  });

  return res.status(200).json({
    success: true,
    message: 'A new verification OTP has been sent to your email.'
  });
});
