import mongoose from 'mongoose';

const firstAidSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان الإسعافات الأولية مطلوب'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['burn', 'cut', 'fracture', 'breathing', 'bleeding', 'poisoning', 'other'],
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'severe'],
    default: 'moderate'
  },
  steps: [{
    stepNumber: Number,
    instruction: String,
    warning: String
  }],
  warnings: [String],
  whenToSeekHelp: [String],
  images: [String],
  videoUrl: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

firstAidSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('FirstAid', firstAidSchema);



