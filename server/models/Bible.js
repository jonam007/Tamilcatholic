import mongoose from 'mongoose';

const verseSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const chapterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  verses: [verseSchema]
});

const bibleBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tamilName: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  testament: {
    type: String,
    enum: ['old', 'new'],
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  chapters: [chapterSchema]
}, {
  timestamps: true
});

// Create index for search
bibleBookSchema.index({ 'chapters.verses.text': 'text' });
bibleBookSchema.index({ tamilName: 'text' });

export default mongoose.model('BibleBook', bibleBookSchema);