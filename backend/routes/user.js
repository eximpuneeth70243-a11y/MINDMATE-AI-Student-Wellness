import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar, preferredTheme } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
        ...(preferredTheme && { preferredTheme })
      },
      { new: true }
    ).select('-password');

    logger.info(`User profile updated: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Get wellness score
router.get('/wellness-score', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        userId: user._id,
        wellnessScore: user.wellnessScore || 0,
        lastUpdated: user.updatedAt
      }
    });
  } catch (error) {
    logger.error('Get wellness score error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wellness score'
    });
  }
});

export default router;