import { ApiError } from '../utils/apiError.js';

const validatePasswordComplexity = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasLetter || !hasNumber || !hasSpecial) {
    return 'Password must contain letters, numbers, and at least one special character (!@#$%^&*)';
  }
  return null;
};

export const validateLoginInput = (req, _res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required fields');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Invalid email address format');
  }

  next();
};

export const validateRegisterInput = (req, _res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required fields');
  }

  const passError = validatePasswordComplexity(password);
  if (passError) {
    throw new ApiError(400, passError);
  }

  next();
};
