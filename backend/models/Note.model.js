import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'عنوان الملاحظة مطلوب'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'محتوى الملاحظة مطلوب']
  },
  category: {
    type: String,
    enum: ['general', 'medical', 'emergency', 'reminder'],
    default: 'general',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('Note', noteSchema);



