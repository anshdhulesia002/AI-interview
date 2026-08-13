import { ApiError } from '../utils/apiError.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(401, 'Unauthorized request: Missing user identity');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Forbidden: Role [${req.user.role}] is not authorized to access this resource`
      );
    }

    next();
  };
};
