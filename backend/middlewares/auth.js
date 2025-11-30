import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Default JWT secret for development if not set
const JWT_SECRET = process.env.JWT_SECRET || 'e-hsptl-dev-secret-key-2024';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'غير مصرح بالوصول - يرجى تسجيل الدخول');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    throw new ApiError(401, 'غير مصرح بالوصول - الرمز غير صالح. يرجى تسجيل الخروج وإعادة تسجيل الدخول');
  }
});



