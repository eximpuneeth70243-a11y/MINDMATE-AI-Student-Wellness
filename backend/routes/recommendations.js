import express from 'express';
import Recommendation from '../models/Recommendation.js';
import { authMiddleware } from '../middleware/auth.js';
import { getRecommendations } from '../services/recommendationService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get personalized recommendations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const recommendations = await getRecommendations(req.user.id);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    logger.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    });
  }
});

// Save feedback on recommendation
router.post('/:recommendationId/feedback', authMiddleware, async (req, res) => {
  try {
    const { helpful } = req.body;

    const recommendation = await Recommendation.findByIdAndUpdate(
      req.params.recommendationId,
      {
        userFeedback: helpful,
        feedbackDate: new Date()
      },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    logger.info(`Feedback saved for recommendation ${req.params.recommendationId}`);

    res.json({
      success: true,
      message: 'Feedback saved successfully',
      data: recommendation
    });
  } catch (error) {
    logger.error('Save feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save feedback'
    });
  }
});

export default router;