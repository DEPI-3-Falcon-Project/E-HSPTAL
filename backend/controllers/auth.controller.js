/* eslint-disable no-undef */
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Default JWT secret for development if not set
const JWT_SECRET = process.env.JWT_SECRET || 'e-hsptl-dev-secret-key-2024';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, specialization } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'المستخدم موجود بالفعل');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    phone,
    specialization
  });

  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }, 'تم التسجيل بنجاح')
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }

  const token = generateToken(user._id);

  res.status(200).json(
    new ApiResponse(200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }, 'تم تسجيل الدخول بنجاح')
  );
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'المستخدم غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, user, 'تم جلب الملف الشخصي بنجاح')
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'المستخدم غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, user, 'تم تحديث الملف الشخصي بنجاح')
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, null, 'تم تسجيل الخروج بنجاح')
  );
});



