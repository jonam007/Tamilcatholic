import mongoose from 'mongoose';

const dailyReadingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  season: {
    type: String,
    required: true // e.g., 'Ordinary Time', 'Advent', 'Lent', etc.
  },
  firstReading: {
    title: { type: String, required: true },
    reference: { type: String, required: true },
    text: { type: String, required: true }
  },
  responsorialPsalm: {
    title: { type: String, required: true },
    reference: { type: String, required: true },
    text: { type: String, required: true },
    response: { type: String, required: true }
  },
  gospelAcclamation: {
    verse: { type: String, required: true },
    text: { type: String, required: true }
  },
  gospel: {
    title: { type: String, required: true },
    reference: { type: String, required: true },
    text: { type: String, required: true }
  },
  prayerOfTheFaithful: {
    type: String
  },
  reflection: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for date-based queries
dailyReadingSchema.index({ date: 1 });
dailyReadingSchema.index({ season: 1 });

export default mongoose.model('DailyReading', dailyReadingSchema);