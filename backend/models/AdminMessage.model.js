import mongoose from 'mongoose';

const adminMessageSchema = new mongoose.Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
    index: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: String,
    required: true,
    index: true
  },
  toName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'الرسالة مطلوبة']
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

adminMessageSchema.index({ to: 1, isRead: 1, createdAt: -1 });
adminMessageSchema.index({ contact: 1 });

export default mongoose.model('AdminMessage', adminMessageSchema);

