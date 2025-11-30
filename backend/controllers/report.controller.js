import Report from '../models/Report.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createReport = asyncHandler(async (req, res) => {
  const { type, title, description, location, address, reporterName, reporterPhone, urgency } = req.body;

  const report = await Report.create({
    type,
    title,
    description,
    location,
    address,
    reporterName,
    reporterPhone,
    urgency: urgency || 'medium'
  });

  res.status(201).json(
    new ApiResponse(201, report, 'تم إنشاء البلاغ بنجاح')
  );
});

export const getAllReports = asyncHandler(async (req, res) => {
  const { status, type, urgency, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status) query.status = status;
  if (type) query.type = type;
  if (urgency) query.urgency = urgency;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await Report.find(query)
    .sort({ urgency: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'تم جلب البلاغات بنجاح')
  );
});

export const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    throw new ApiError(404, 'البلاغ غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, report, 'تم جلب البلاغ بنجاح')
  );
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!report) {
    throw new ApiError(404, 'البلاغ غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, report, 'تم تحديث حالة البلاغ بنجاح')
  );
});

export const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndDelete(req.params.id);

  if (!report) {
    throw new ApiError(404, 'البلاغ غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف البلاغ بنجاح')
  );
});

export const getNearbyReports = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 50000 } = req.query;

  if (!latitude || !longitude) {
    throw new ApiError(400, 'خط العرض وخط الطول مطلوبان');
  }

  const reports = await Report.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(radius)
      }
    },
    status: { $ne: 'resolved' }
  }).limit(50);

  res.status(200).json(
    new ApiResponse(200, reports, 'تم جلب البلاغات القريبة بنجاح')
  );
});



