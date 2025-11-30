import AdminMessage from '../models/AdminMessage.model.js';
import Contact from '../models/Contact.model.js';
import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { contactId, message } = req.body;

  if (!contactId || !message) {
    throw new ApiError(400, 'معرف الرسالة والرد مطلوبان');
  }

  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw new ApiError(404, 'الرسالة غير موجودة');
  }

  const adminMessage = await AdminMessage.create({
    contact: contactId,
    from: req.user.id,
    to: contact.email,
    toName: contact.name,
    subject: `رد على: ${contact.subject}`,
    message
  });

  await Contact.findByIdAndUpdate(contactId, { status: 'replied' });

  const user = await User.findOne({ email: contact.email });
  if (user) {
    await Notification.create({
      user: user._id,
      type: 'info',
      title: 'رد من الإدارة',
      message: `تم الرد على رسالتك: ${contact.subject.substring(0, 50)}${contact.subject.length > 50 ? '...' : ''}`,
      relatedId: adminMessage._id,
      relatedModel: 'AdminMessage'
    });
  }

  res.status(201).json(
    new ApiResponse(201, adminMessage, 'تم إرسال الرد بنجاح')
  );
});

export const getMyMessages = asyncHandler(async (req, res) => {
  const { isRead, page = 1, limit = 20 } = req.query;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'المستخدم غير موجود');
  }

  const query = { to: user.email };
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const messages = await AdminMessage.find(query)
    .populate('from', 'name email')
    .populate('contact', 'subject')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await AdminMessage.countDocuments(query);
  const unreadCount = await AdminMessage.countDocuments({ 
    to: user.email, 
    isRead: false 
  });

  res.status(200).json(
    new ApiResponse(200, {
      messages,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'تم جلب الرسائل بنجاح')
  );
});

export const getMessageById = asyncHandler(async (req, res) => {
  const message = await AdminMessage.findById(req.params.id)
    .populate('from', 'name email')
    .populate('contact', 'subject message');

  if (!message) {
    throw new ApiError(404, 'الرسالة غير موجودة');
  }

  if (!message.isRead) {
    message.isRead = true;
    await message.save();
  }

  res.status(200).json(
    new ApiResponse(200, message, 'تم جلب الرسالة بنجاح')
  );
});

export const markAsRead = asyncHandler(async (req, res) => {
  const message = await AdminMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    throw new ApiError(404, 'الرسالة غير موجودة');
  }

  res.status(200).json(
    new ApiResponse(200, message, 'تم تحديث حالة الرسالة بنجاح')
  );
});

