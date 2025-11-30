import Notification from '../models/Notification.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const { isRead, page = 1, limit = 20 } = req.query;

  const query = { user: req.user.id };
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });

  res.status(200).json(
    new ApiResponse(200, {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'تم جلب الإشعارات بنجاح')
  );
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'الإشعار غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, notification, 'تم تحديث الإشعار بنجاح')
  );
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json(
    new ApiResponse(200, null, 'تم تحديث جميع الإشعارات بنجاح')
  );
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!notification) {
    throw new ApiError(404, 'الإشعار غير موجود');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف الإشعار بنجاح')
  );
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user.id });

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف جميع الإشعارات بنجاح')
  );
});



