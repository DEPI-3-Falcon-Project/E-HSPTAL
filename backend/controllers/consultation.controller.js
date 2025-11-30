import Consultation from '../models/Consultation.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// إنشاء استشارة جديدة (للمستخدمين)
export const createConsultation = asyncHandler(async (req, res) => {
  const { question, category, attachments, isUrgent } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'المستخدم غير موجود');
  }

  const consultation = await Consultation.create({
    patient: req.user.id,
    patientName: user.name,
    question,
    category: category || 'general',
    attachments: attachments || [],
    isUrgent: isUrgent || false
  });

  // إرسال إشعار للأطباء
  const doctors = await User.find({ role: 'doctor' });
  for (const doctor of doctors) {
    await Notification.create({
      user: doctor._id,
      type: 'info',
      title: 'استشارة طبية جديدة',
      message: `استشارة جديدة من ${user.name} في قسم ${getCategoryLabel(category)}`,
      relatedId: consultation._id,
      relatedModel: 'Consultation'
    });
  }

  res.status(201).json(
    new ApiResponse(201, consultation, 'تم إرسال استشارتك بنجاح')
  );
});

// جلب جميع الاستشارات (للأطباء)
export const getAllConsultations = asyncHandler(async (req, res) => {
  const { status, category, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { question: { $regex: search, $options: 'i' } },
      { patientName: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const consultations = await Consultation.find(query)
    .populate('patient', 'name email')
    .populate('respondedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Consultation.countDocuments(query);

  // إحصائيات
  const stats = {
    new: await Consultation.countDocuments({ status: 'new' }),
    pending: await Consultation.countDocuments({ status: 'pending' }),
    answered: await Consultation.countDocuments({ status: 'answered' })
  };

  res.status(200).json(
    new ApiResponse(200, {
      consultations,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    }, 'تم جلب الاستشارات بنجاح')
  );
});

// جلب استشارة واحدة
export const getConsultationById = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id)
    .populate('patient', 'name email phone')
    .populate('respondedBy', 'name');

  if (!consultation) {
    throw new ApiError(404, 'الاستشارة غير موجودة');
  }

  res.status(200).json(
    new ApiResponse(200, consultation, 'تم جلب الاستشارة بنجاح')
  );
});

// الرد على استشارة (للأطباء)
export const respondToConsultation = asyncHandler(async (req, res) => {
  const { response, status } = req.body;

  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) {
    throw new ApiError(404, 'الاستشارة غير موجودة');
  }

  consultation.response = response;
  consultation.status = status || 'answered';
  consultation.respondedBy = req.user.id;
  consultation.respondedAt = new Date();

  await consultation.save();

  // إرسال إشعار للمريض
  await Notification.create({
    user: consultation.patient,
    type: 'success',
    title: 'تم الرد على استشارتك',
    message: 'قام الطبيب بالرد على استشارتك الطبية. اضغط هنا للاطلاع على الرد.',
    relatedId: consultation._id,
    relatedModel: 'Consultation'
  });

  res.status(200).json(
    new ApiResponse(200, consultation, 'تم إرسال الرد بنجاح')
  );
});

// جلب استشاراتي (للمستخدم)
export const getMyConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find({ patient: req.user.id })
    .populate('respondedBy', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, consultations, 'تم جلب استشاراتك بنجاح')
  );
});

// تحديث استشارة (للمستخدم فقط قبل الرد)
export const updateConsultation = asyncHandler(async (req, res) => {
  const { question, category, isUrgent } = req.body;
  
  const consultation = await Consultation.findById(req.params.id);
  
  if (!consultation) {
    throw new ApiError(404, 'الاستشارة غير موجودة');
  }

  // التحقق من الصلاحية - فقط المريض يمكنه التعديل
  if (consultation.patient.toString() !== req.user.id) {
    throw new ApiError(403, 'غير مصرح لك بتعديل هذه الاستشارة');
  }

  // لا يمكن التعديل إذا تم الرد عليها
  if (consultation.status === 'answered' || consultation.response) {
    throw new ApiError(400, 'لا يمكن تعديل الاستشارة بعد الرد عليها');
  }

  // تحديث البيانات
  if (question) consultation.question = question;
  if (category) consultation.category = category;
  if (isUrgent !== undefined) consultation.isUrgent = isUrgent;

  await consultation.save();

  res.status(200).json(
    new ApiResponse(200, consultation, 'تم تحديث الاستشارة بنجاح')
  );
});

// حذف استشارة
export const deleteConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);
  
  if (!consultation) {
    throw new ApiError(404, 'الاستشارة غير موجودة');
  }

  // التحقق من الصلاحية
  if (consultation.patient.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'غير مصرح لك بحذف هذه الاستشارة');
  }

  await consultation.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف الاستشارة بنجاح')
  );
});

// Helper function
function getCategoryLabel(category) {
  const labels = {
    general: 'طب عام',
    pediatrics: 'أطفال',
    cardiology: 'قلب',
    dermatology: 'جلدية',
    orthopedics: 'عظام',
    neurology: 'مخ وأعصاب',
    gynecology: 'نساء وتوليد',
    psychiatry: 'نفسية',
    other: 'أخرى'
  };
  return labels[category] || 'طب عام';
}

