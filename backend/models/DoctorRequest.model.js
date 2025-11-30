import mongoose from 'mongoose';

const doctorRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'الاسم الكامل مطلوب'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'التخصص مطلوب'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'رقم الترخيص مطلوب'],
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'سنوات الخبرة مطلوبة'],
    min: 0
  },
  hospital: {
    type: String,
    trim: true
  },
  qualifications: {
    type: String,
    required: [true, 'المؤهلات مطلوبة']
  },
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  reviewNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

doctorRequestSchema.index({ createdAt: -1 });
doctorRequestSchema.index({ user: 1, status: 1 });

export default mongoose.model('DoctorRequest', doctorRequestSchema);



