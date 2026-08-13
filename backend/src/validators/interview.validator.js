import { ApiError } from '../utils/apiError.js';

export const validateCreateInterviewInput = (req, _res, next) => {
  const { title, domain } = req.body;

  if (!title || !domain) {
    throw new ApiError(400, 'Title and domain are required fields');
  }

  const validDomains = ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'System Design', 'AI/ML', 'General'];
  if (!validDomains.includes(domain)) {
    throw new ApiError(400, `Domain must be one of: ${validDomains.join(', ')}`);
  }

  next();
};
