import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'doctor_request', 'admin_alert'],
    default: 'info',
    index: true
  },
  title: {
    type: String,
    required: [true, 'عنوان الإشعار مطلوب'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'رسالة الإشعار مطلوبة']
  },
  link: {
    type: String,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
      relatedModel: {
        type: String,
        enum: ['DoctorRequest', 'Report', 'Note', 'Contact', 'Consultation', 'AdminMessage']
      }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);



