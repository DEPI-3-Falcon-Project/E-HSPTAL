import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';

export const requireAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user || user.role !== 'admin') {
    throw new ApiError(403, 'غير مصرح بالوصول - صلاحيات أدمن مطلوبة');
  }
  
  next();
});


