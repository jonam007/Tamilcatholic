import express from 'express';
import PrayerRequest from '../models/PrayerRequest.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get approved prayer requests
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = { isApproved: true };
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const prayers = await PrayerRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('approvedBy', 'name');
    
    const total = await PrayerRequest.countDocuments(filter);
    
    res.json({
      success: true,
      prayers,
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
      message: 'Error fetching prayer requests',
      error: error.message
    });
  }
});

// Submit new prayer request
router.post('/', async (req, res) => {
  try {
    const { name, location, intention, category, email } = req.body;
    
    if (!name || !location || !intention) {
      return res.status(400).json({
        success: false,
        message: 'Name, location, and intention are required'
      });
    }
    
    const prayerRequest = new PrayerRequest({
      name: name.trim(),
      location: location.trim(),
      intention: intention.trim(),
      category: category || 'other',
      email: email ? email.trim() : undefined,
      submittedBy: req.isAuthenticated() ? req.user._id : undefined
    });
    
    await prayerRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Prayer request submitted successfully. It will be reviewed before being published.',
      prayerRequest: {
        id: prayerRequest._id,
        name: prayerRequest.name,
        location: prayerRequest.location,
        intention: prayerRequest.intention,
        category: prayerRequest.category
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting prayer request',
      error: error.message
    });
  }
});

// Get pending prayer requests (Admin only)
router.get('/pending', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const prayers = await PrayerRequest.find({ isApproved: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('submittedBy', 'name email');
    
    const total = await PrayerRequest.countDocuments({ isApproved: false });
    
    res.json({
      success: true,
      prayers,
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
      message: 'Error fetching pending prayer requests',
      error: error.message
    });
  }
});

// Approve prayer request (Admin only)
router.put('/:id/approve', isAdmin, async (req, res) => {
  try {
    const prayer = await PrayerRequest.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    );
    
    if (!prayer) {
      return res.status(404).json({
        success: false,
        message: 'Prayer request not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Prayer request approved successfully',
      prayer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving prayer request',
      error: error.message
    });
  }
});

// Reject/Delete prayer request (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const prayer = await PrayerRequest.findByIdAndDelete(req.params.id);
    
    if (!prayer) {
      return res.status(404).json({
        success: false,
        message: 'Prayer request not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Prayer request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting prayer request',
      error: error.message
    });
  }
});

export default router;