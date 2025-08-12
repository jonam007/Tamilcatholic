import express from 'express';
import BibleBook from '../models/Bible.js';

const router = express.Router();

// Get all Bible books
router.get('/books', async (req, res) => {
  try {
    const books = await BibleBook.find({}, 'name tamilName shortName testament order')
      .sort({ order: 1 });
    
    res.json({
      success: true,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching Bible books',
      error: error.message
    });
  }
});

// Get a specific book with all chapters
router.get('/books/:bookId', async (req, res) => {
  try {
    const book = await BibleBook.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching Bible book',
      error: error.message
    });
  }
});

// Get a specific chapter
router.get('/books/:bookId/chapters/:chapterNum', async (req, res) => {
  try {
    const { bookId, chapterNum } = req.params;
    const book = await BibleBook.findById(bookId);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    const chapter = book.chapters.find(ch => ch.number === parseInt(chapterNum));
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    res.json({
      success: true,
      book: {
        name: book.name,
        tamilName: book.tamilName,
        shortName: book.shortName
      },
      chapter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chapter',
      error: error.message
    });
  }
});

// Search Bible verses
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const books = await BibleBook.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(parseInt(limit));
    
    // Extract matching verses
    const results = [];
    
    books.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          if (verse.text.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              bookName: book.tamilName,
              bookId: book._id,
              chapterNumber: chapter.number,
              verseNumber: verse.number,
              text: verse.text,
              reference: `${book.tamilName} ${chapter.number}:${verse.number}`
            });
          }
        });
      });
    });
    
    res.json({
      success: true,
      results: results.slice(0, parseInt(limit)),
      total: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching Bible',
      error: error.message
    });
  }
});

export default router;