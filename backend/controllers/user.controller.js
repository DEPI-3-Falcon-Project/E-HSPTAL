import User from '../models/User.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// جلب جميع المستخدمين (للأدمن فقط)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (role && role !== 'all') {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  // إحصائيات
  const stats = {
    total: await User.countDocuments({}),
    users: await User.countDocuments({ role: 'user' }),
    doctors: await User.countDocuments({ role: 'doctor' }),
    admins: await User.countDocuments({ role: 'admin' })
  };

  res.status(200).json(
    new ApiResponse(200, {
      users,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    }, 'تم جلب المستخدمين بنجاح')
  );
});

// حذف مستخدم (للأدمن فقط)
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'المستخدم غير موجود');
  }

  // منع حذف الأدمن
  if (user.role === 'admin') {
    throw new ApiError(403, 'لا يمكن حذف حساب أدمن');
  }

  // منع حذف نفسه
  if (user._id.toString() === req.user.id) {
    throw new ApiError(403, 'لا يمكنك حذف حسابك الخاص');
  }

  await user.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف المستخدم بنجاح')
  );
});

// جلب مستخدم واحد
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    throw new ApiError(404, 'المستخدم غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, user, 'تم جلب المستخدم بنجاح')
  );
});


