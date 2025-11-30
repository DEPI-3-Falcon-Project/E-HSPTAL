import DoctorRequest from '../models/DoctorRequest.model.js';
import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createDoctorRequest = asyncHandler(async (req, res) => {
  const { fullName, specialization, licenseNumber, yearsOfExperience, hospital, qualifications, documents } = req.body;

  const existingRequest = await DoctorRequest.findOne({
    user: req.user.id,
    status: { $in: ['pending', 'approved'] }
  });

  if (existingRequest) {
    if (existingRequest.status === 'approved') {
      throw new ApiError(400, 'لديك حساب طبيب مفعل بالفعل');
    }
    throw new ApiError(400, 'لديك طلب قيد المراجعة بالفعل');
  }

  const request = await DoctorRequest.create({
    user: req.user.id,
    fullName,
    specialization,
    licenseNumber,
    yearsOfExperience,
    hospital,
    qualifications,
    documents: documents || []
  });

  // إشعار للمستخدم
  await Notification.create({
    user: req.user.id,
    type: 'doctor_request',
    title: 'تم استلام طلبك',
    message: 'تم استلام طلب إنشاء حساب طبي. طلبك قيد المراجعة من قبل المسؤولين. ستتلقى إشعاراً عندما يُراجع.',
    relatedId: request._id,
    relatedModel: 'DoctorRequest'
  });

  // إرسال إشعار لجميع الأدمن
  const admins = await User.find({ role: 'admin' });
  const adminNotifications = admins.map(admin => ({
    user: admin._id,
    type: 'admin_alert',
    title: 'طلب حساب طبيب جديد',
    message: `قدّم ${fullName} طلباً لإنشاء حساب طبيب بتخصص ${specialization}. يرجى مراجعة الطلب.`,
    relatedId: request._id,
    relatedModel: 'DoctorRequest',
    link: '/admin'
  }));
  
  if (adminNotifications.length > 0) {
    await Notification.insertMany(adminNotifications);
  }

  res.status(201).json(
    new ApiResponse(201, request, 'تم إرسال طلبك بنجاح. سيتم إبلاغك بالنتيجة قريباً')
  );
});

export const getMyRequest = asyncHandler(async (req, res) => {
  const request = await DoctorRequest.findOne({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, request, 'تم جلب الطلب بنجاح')
  );
});

export const getAllRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const requests = await DoctorRequest.find(query)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await DoctorRequest.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'تم جلب الطلبات بنجاح')
  );
});

export const getRequestById = asyncHandler(async (req, res) => {
  const request = await DoctorRequest.findById(req.params.id)
    .populate('user', 'name email phone');

  if (!request) {
    throw new ApiError(404, 'الطلب غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, request, 'تم جلب الطلب بنجاح')
  );
});

export const approveRequest = asyncHandler(async (req, res) => {
  const request = await DoctorRequest.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, 'الطلب غير موجود');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'تمت مراجعة هذا الطلب بالفعل');
  }

  request.status = 'approved';
  request.reviewedBy = req.user.id;
  request.reviewedAt = new Date();
  request.reviewNotes = req.body.notes || '';
  await request.save();

  await User.findByIdAndUpdate(request.user, {
    role: 'doctor',
    specialization: request.specialization
  });

  await Notification.create({
    user: request.user,
    type: 'success',
    title: 'تمت الموافقة على طلبك',
    message: 'تمت الموافقة على حسابك كطبيب. يمكنك الآن تسجيل الدخول إلى لوحة الأطباء.',
    link: '/doctor-login',
    relatedId: request._id,
    relatedModel: 'DoctorRequest'
  });

  res.status(200).json(
    new ApiResponse(200, request, 'تمت الموافقة على الطلب بنجاح')
  );
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { notes } = req.body;

  if (!notes || notes.trim() === '') {
    throw new ApiError(400, 'يرجى تقديم سبب الرفض');
  }

  const request = await DoctorRequest.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, 'الطلب غير موجود');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'تمت مراجعة هذا الطلب بالفعل');
  }

  request.status = 'rejected';
  request.reviewedBy = req.user.id;
  request.reviewedAt = new Date();
  request.reviewNotes = notes;
  await request.save();

  await Notification.create({
    user: request.user,
    type: 'error',
    title: 'تم رفض طلبك',
    message: `طلبك تم رفضه. سبب الرفض: ${notes}`,
    relatedId: request._id,
    relatedModel: 'DoctorRequest'
  });

  res.status(200).json(
    new ApiResponse(200, request, 'تم رفض الطلب')
  );
});

export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await DoctorRequest.findByIdAndDelete(req.params.id);

  if (!request) {
    throw new ApiError(404, 'الطلب غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف الطلب بنجاح')
  );
});



