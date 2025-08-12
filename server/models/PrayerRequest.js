import mongoose from 'mongoose';

const prayerRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  intention: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['health', 'family', 'work', 'studies', 'spiritual', 'other'],
    default: 'other'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    trim: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for approved prayers
prayerRequestSchema.index({ isApproved: 1, createdAt: -1 });
prayerRequestSchema.index({ category: 1 });

export default mongoose.model('PrayerRequest', prayerRequestSchema);