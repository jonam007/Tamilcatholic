import express from 'express';
import BibleBook from '../models/Bible.js';
import DailyReading from '../models/DailyReading.js';
import BlogPost from '../models/BlogPost.js';
import PrayerRequest from '../models/PrayerRequest.js';

const router = express.Router();

// Universal search endpoint
router.get('/', async (req, res) => {
  try {
    const { query, type = 'all', limit = 10 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const searchTerm = query.trim();
    const results = {};
    
    // Search Bible verses
    if (type === 'all' || type === 'bible') {
      const bibleResults = [];
      const books = await BibleBook.find();
      
      books.forEach(book => {
        book.chapters.forEach(chapter => {
          chapter.verses.forEach(verse => {
            if (verse.text.toLowerCase().includes(searchTerm.toLowerCase())) {
              bibleResults.push({
                type: 'bible',
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
      
      results.bible = bibleResults.slice(0, parseInt(limit));
    }
    
    // Search Daily Readings
    if (type === 'all' || type === 'readings') {
      const readingResults = await DailyReading.find({
        isPublished: true,
        $or: [
          { 'firstReading.text': { $regex: searchTerm, $options: 'i' } },
          { 'responsorialPsalm.text': { $regex: searchTerm, $options: 'i' } },
          { 'gospel.text': { $regex: searchTerm, $options: 'i' } },
          { 'reflection': { $regex: searchTerm, $options: 'i' } }
        ]
      }).limit(parseInt(limit)).select('date firstReading gospel season');
      
      results.readings = readingResults.map(reading => ({
        type: 'reading',
        id: reading._id,
        date: reading.date,
        season: reading.season,
        firstReading: reading.firstReading.title,
        gospel: reading.gospel.title
      }));
    }
    
    // Search Blog Posts
    if (type === 'all' || type === 'blog') {
      const blogResults = await BlogPost.find({
        isPublished: true,
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { content: { $regex: searchTerm, $options: 'i' } },
          { excerpt: { $regex: searchTerm, $options: 'i' } },
          { tags: { $regex: searchTerm, $options: 'i' } }
        ]
      })
      .limit(parseInt(limit))
      .populate('author', 'name')
      .select('title slug excerpt publishedAt category author readingTime');
      
      results.blog = blogResults.map(post => ({
        type: 'blog',
        id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        category: post.category,
        author: post.author.name,
        readingTime: post.readingTime
      }));
    }
    
    // Search Prayer Requests
    if (type === 'all' || type === 'prayers') {
      const prayerResults = await PrayerRequest.find({
        isApproved: true,
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { location: { $regex: searchTerm, $options: 'i' } },
          { intention: { $regex: searchTerm, $options: 'i' } }
        ]
      })
      .limit(parseInt(limit))
      .select('name location intention category createdAt');
      
      results.prayers = prayerResults.map(prayer => ({
        type: 'prayer',
        id: prayer._id,
        name: prayer.name,
        location: prayer.location,
        intention: prayer.intention,
        category: prayer.category,
        createdAt: prayer.createdAt
      }));
    }
    
    // Calculate total results
    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    
    res.json({
      success: true,
      query: searchTerm,
      results,
      totalResults,
      hasResults: totalResults > 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
});

export default router;