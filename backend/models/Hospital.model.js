import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المستشفى مطلوب'],
    trim: true,
    index: true
  },
  type: {
    type: String,
    enum: ['hospital', 'clinic', 'pharmacy'],
    default: 'hospital',
    index: true
  },
  governorate: {
    type: String,
    required: [true, 'المحافظة مطلوبة'],
    index: true
  },
  city: {
    type: String,
    required: [true, 'المدينة مطلوبة'],
    index: true
  },
  address: {
    type: String,
    required: [true, 'العنوان مطلوب']
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
  phone: String,
  emergencyPhone: String,
  services: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  workingHours: {
    open: String,
    close: String
  }
}, {
  timestamps: true
});

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ name: 'text', address: 'text', services: 'text' });

hospitalSchema.statics.findNearby = async function(latitude, longitude, maxDistance = 30000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  }).limit(50);
};

export default mongoose.model('Hospital', hospitalSchema);



