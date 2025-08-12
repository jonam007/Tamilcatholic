import express from 'express';
import { isAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import DailyReading from '../models/DailyReading.js';
import BlogPost from '../models/BlogPost.js';
import PrayerRequest from '../models/PrayerRequest.js';
import BibleBook from '../models/Bible.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(isAdmin);

// Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      DailyReading.countDocuments(),
      BlogPost.countDocuments({ isPublished: true }),
      PrayerRequest.countDocuments({ isApproved: true }),
      PrayerRequest.countDocuments({ isApproved: false }),
      BibleBook.countDocuments()
    ]);
    
    const [
      totalUsers,
      totalReadings,
      publishedPosts,
      approvedPrayers,
      pendingPrayers,
      bibleBooks
    ] = stats;
    
    // Get recent activity
    const recentPrayers = await PrayerRequest.find({ isApproved: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name location intention createdAt');
    
    const recentPosts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name')
      .select('title author createdAt isPublished');
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReadings,
        publishedPosts,
        approvedPrayers,
        pendingPrayers,
        bibleBooks
      },
      recentActivity: {
        recentPrayers,
        recentPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-googleId'); // Don't expose Google ID
    
    const total = await User.countDocuments();
    
    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-googleId');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Prayer requests analytics
    const prayerStats = await PrayerRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            category: '$category',
            approved: '$isApproved'
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Blog posts analytics
    const blogStats = await BlogPost.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      }
    ]);
    
    // Daily readings analytics
    const readingStats = await DailyReading.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$season',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      analytics: {
        dateRange: { start, end },
        prayerStats,
        blogStats,
        readingStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

export default router;