import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['accident', 'crime', 'health', 'missing', 'help'],
    required: [true, 'نوع البلاغ مطلوب'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'عنوان البلاغ مطلوب'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'وصف البلاغ مطلوب']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  address: {
    type: String,
    required: true
  },
  reporterName: {
    type: String,
    required: [true, 'اسم المبلغ مطلوب']
  },
  reporterPhone: {
    type: String,
    required: [true, 'رقم هاتف المبلغ مطلوب']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'cancelled'],
    default: 'pending',
    index: true
  },
  images: [String],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

reportSchema.index({ location: '2dsphere' });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ status: 1, urgency: -1 });

export default mongoose.model('Report', reportSchema);



