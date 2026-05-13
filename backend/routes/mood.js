import express from 'express';
import MoodLog from '../models/MoodLog.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateMoodScore, validateEmotionType } from '../utils/validators.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Log mood
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { moodScore, emotion, notes } = req.body;

    if (!validateMoodScore(moodScore)) {
      return res.status(400).json({
        success: false,
        message: 'Mood score must be between 1 and 10'
      });
    }

    if (emotion && !validateEmotionType(emotion)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid emotion type'
      });
    }

    const moodLog = new MoodLog({
      userId: req.user.id,
      moodScore,
      emotion: emotion || 'neutral',
      notes: notes || '',
      timestamp: new Date()
    });

    await moodLog.save();
    logger.info(`Mood logged for user ${req.user.id}: ${moodScore}`);

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      data: moodLog
    });
  } catch (error) {
    logger.error('Log mood error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log mood'
    });
  }
});

// Get mood trends
router.get('/trends', authMiddleware, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await MoodLog.find({
      userId: req.user.id,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    const average = trends.length > 0
      ? (trends.reduce((sum, log) => sum + log.moodScore, 0) / trends.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        trends,
        average,
        count: trends.length
      }
    });
  } catch (error) {
    logger.error('Get mood trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mood trends'
    });
  }
});

export default router;