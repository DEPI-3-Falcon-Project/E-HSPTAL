import Contact from "../models/Contact.model.js";
import Notification from "../models/Notification.model.js";
import User from "../models/User.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, contactType } = req.body;

  // Validate that at least one contact method is provided
  if (!email && !phone) {
    throw new ApiError(400, "يجب توفير بريد إلكتروني أو رقم هاتف");
  }

  // Prepare attachment data if file exists
  const attachment = req.file
    ? {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
      }
    : null;

  const contact = await Contact.create({
    name,
    email: email || null,
    phone: phone || null,
    contactType: contactType || "email",
    subject,
    message,
    attachment: attachment,
  });

  // إرسال إشعار لجميع الأدمن
  const admins = await User.find({ role: "admin" });
  const adminNotifications = admins.map((admin) => ({
    user: admin._id,
    type: "admin_alert",
    title: "رسالة تواصل جديدة",
    message: `رسالة جديدة من ${name}: ${subject.substring(0, 50)}${
      subject.length > 50 ? "..." : ""
    }`,
    relatedId: contact._id,
    relatedModel: "Contact",
    link: "/admin",
  }));

  if (adminNotifications.length > 0) {
    await Notification.insertMany(adminNotifications);
  }

  res.status(201).json(new ApiResponse(201, contact, "تم إرسال الرسالة بنجاح"));
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const { status, priority, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const contacts = await Contact.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Contact.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      "تم جلب الرسائل بنجاح"
    )
  );
});

export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "الرسالة غير موجودة");
  }

  if (contact.status === "new") {
    contact.status = "read";
    await contact.save();
  }

  res.status(200).json(new ApiResponse(200, contact, "تم جلب الرسالة بنجاح"));
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    throw new ApiError(404, "الرسالة غير موجودة");
  }

  res
    .status(200)
    .json(new ApiResponse(200, contact, "تم تحديث حالة الرسالة بنجاح"));
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    throw new ApiError(404, "الرسالة غير موجودة");
  }

  res.status(200).json(new ApiResponse(200, null, "تم حذف الرسالة بنجاح"));
});
