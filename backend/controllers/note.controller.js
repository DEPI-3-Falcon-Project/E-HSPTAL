import Note from '../models/Note.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, category, priority, tags } = req.body;

  const note = await Note.create({
    user: req.user.id,
    title,
    content,
    category,
    priority,
    tags
  });

  res.status(201).json(
    new ApiResponse(201, note, 'تم إنشاء الملاحظة بنجاح')
  );
});

export const getUserNotes = asyncHandler(async (req, res) => {
  const { category, priority, search, page = 1, limit = 20 } = req.query;

  const query = { user: req.user.id, isArchived: false };

  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const notes = await Note.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Note.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }, 'تم جلب الملاحظات بنجاح')
  );
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!note) {
    throw new ApiError(404, 'الملاحظة غير موجودة');
  }

  res.status(200).json(
    new ApiResponse(200, note, 'تم جلب الملاحظة بنجاح')
  );
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new ApiError(404, 'الملاحظة غير موجودة');
  }

  res.status(200).json(
    new ApiResponse(200, note, 'تم تحديث الملاحظة بنجاح')
  );
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!note) {
    throw new ApiError(404, 'الملاحظة غير موجودة');
  }

  res.status(200).json(
    new ApiResponse(200, null, 'تم حذف الملاحظة بنجاح')
  );
});

export const archiveNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isArchived: true },
    { new: true }
  );

  if (!note) {
    throw new ApiError(404, 'الملاحظة غير موجودة');
  }

  res.status(200).json(
    new ApiResponse(200, note, 'تم أرشفة الملاحظة بنجاح')
  );
});



