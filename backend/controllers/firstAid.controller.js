import FirstAid from '../models/FirstAid.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllFirstAid = asyncHandler(async (req, res) => {
  const { category, severity, search } = req.query;

  const query = { isActive: true };

  if (category) query.category = category;
  if (severity) query.severity = severity;
  if (search) {
    query.$text = { $search: search };
  }

  const firstAids = await FirstAid.find(query).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, firstAids, 'تم جلب الإسعافات الأولية بنجاح')
  );
});

export const getFirstAidById = asyncHandler(async (req, res) => {
  const firstAid = await FirstAid.findById(req.params.id);

  if (!firstAid) {
    throw new ApiError(404, 'الإسعاف الأولي غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, firstAid, 'تم جلب الإسعاف الأولي بنجاح')
  );
});

export const getFirstAidByCategory = asyncHandler(async (req, res) => {
  const firstAids = await FirstAid.find({
    category: req.params.category,
    isActive: true
  });

  res.status(200).json(
    new ApiResponse(200, firstAids, 'تم جلب الإسعافات الأولية بنجاح')
  );
});

export const createFirstAid = asyncHandler(async (req, res) => {
  const firstAid = await FirstAid.create(req.body);

  res.status(201).json(
    new ApiResponse(201, firstAid, 'تم إنشاء الإسعاف الأولي بنجاح')
  );
});

export const updateFirstAid = asyncHandler(async (req, res) => {
  const firstAid = await FirstAid.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!firstAid) {
    throw new ApiError(404, 'الإسعاف الأولي غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, firstAid, 'تم تحديث الإسعاف الأولي بنجاح')
  );
});

export const deleteFirstAid = asyncHandler(async (req, res) => {
  const firstAid = await FirstAid.findByIdAndDelete(req.params.id);

  if (!firstAid) {
    throw new ApiError(404, 'الإسعاف الأولي غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف الإسعاف الأولي بنجاح')
  );
});



