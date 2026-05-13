import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import MoodLog from '../models/MoodLog.js';
import ChatMessage from '../models/ChatMessage.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get admin analytics
router.get('/analytics', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMoodLogs = await MoodLog.countDocuments();
    const totalChats = await ChatMessage.countDocuments();

    const activeUsers = await User.find({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalMoodLogs,
        totalChats,
        engagementRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    logger.error('Admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get admin analytics'
    });
  }
});

// Get all users (anonymized)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('name email role createdAt lastLogin');

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

export default router;