import express from 'express';
import MoodLog from '../models/MoodLog.js';
import Task from '../models/Task.js';
import ChatMessage from '../models/ChatMessage.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateWellnessScore, getEmotionTrend, calculateBurnoutRisk } from '../utils/helpers.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get analytics dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get mood data
    const moodLogs = await MoodLog.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: -1 });

    // Get task data
    const allTasks = await Task.find({ userId });
    const completedTasks = allTasks.filter(t => t.completed).length;
    const taskCompletionRate = allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0;

    // Get chat statistics
    const chatCount = await ChatMessage.countDocuments({
      userId,
      sender: 'user'
    });

    // Calculate metrics
    const wellnessScore = generateWellnessScore(moodLogs);
    const emotionTrend = getEmotionTrend(moodLogs);
    const burnoutRisk = calculateBurnoutRisk(moodLogs, taskCompletionRate);

    res.json({
      success: true,
      data: {
        wellnessScore,
        emotionTrend,
        burnoutRisk,
        moodLogs,
        taskCompletionRate,
        chatInteractions: chatCount,
        taskStats: {
          total: allTasks.length,
          completed: completedTasks,
          pending: allTasks.length - completedTasks
        }
      }
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
});

// Generate wellness report
router.get('/report', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodLogs = await MoodLog.find({
      userId,
      timestamp: { $gte: thirtyDaysAgo }
    });

    const emotionCounts = {};
    moodLogs.forEach(log => {
      emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        period: '30 days',
        totalEntries: moodLogs.length,
        averageMood: moodLogs.length > 0
          ? (moodLogs.reduce((sum, log) => sum + log.moodScore, 0) / moodLogs.length).toFixed(1)
          : 0,
        emotionBreakdown: emotionCounts,
        moodLogs
      }
    });
  } catch (error) {
    logger.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
});

export default router;