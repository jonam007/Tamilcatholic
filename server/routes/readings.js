import express from 'express';
import DailyReading from '../models/DailyReading.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get readings for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    // Set time to start of day for accurate matching
    targetDate.setHours(0, 0, 0, 0);
    
    const reading = await DailyReading.findOne({ 
      date: targetDate,
      isPublished: true
    }).populate('createdBy', 'name');
    
    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'No readings found for this date'
      });
    }
    
    res.json({
      success: true,
      reading
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily reading',
      error: error.message
    });
  }
});

// Get readings for a date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    const readings = await DailyReading.find({
      date: { $gte: start, $lte: end },
      isPublished: true
    }).sort({ date: 1 }).populate('createdBy', 'name');
    
    res.json({
      success: true,
      readings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching readings',
      error: error.message
    });
  }
});

// Create new daily reading (Admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const readingData = { ...req.body, createdBy: req.user._id };
    const reading = new DailyReading(readingData);
    await reading.save();
    
    res.status(201).json({
      success: true,
      reading,
      message: 'Daily reading created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating daily reading',
      error: error.message
    });
  }
});

// Update daily reading (Admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const reading = await DailyReading.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found'
      });
    }
    
    res.json({
      success: true,
      reading,
      message: 'Daily reading updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating daily reading',
      error: error.message
    });
  }
});

// Delete daily reading (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const reading = await DailyReading.findByIdAndDelete(req.params.id);
    
    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Daily reading deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting daily reading',
      error: error.message
    });
  }
});

export default router;