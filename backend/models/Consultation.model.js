import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  patientName: {
    type: String,
    required: [true, 'اسم المريض مطلوب'],
    trim: true
  },
  question: {
    type: String,
    required: [true, 'السؤال مطلوب'],
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'pediatrics', 'cardiology', 'dermatology', 'orthopedics', 'neurology', 'gynecology', 'psychiatry', 'other'],
    default: 'general',
    index: true
  },
  status: {
    type: String,
    enum: ['new', 'pending', 'answered', 'follow-up'],
    default: 'new',
    index: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  response: {
    type: String,
    trim: true
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: {
    type: Date
  },
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
consultationSchema.index({ status: 1, createdAt: -1 });
consultationSchema.index({ category: 1, status: 1 });

export default mongoose.model('Consultation', consultationSchema);


