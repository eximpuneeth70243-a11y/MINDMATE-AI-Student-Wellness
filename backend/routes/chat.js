import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import { authMiddleware } from '../middleware/auth.js';
import { getAIResponse } from '../services/aiService.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Send message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    // Save user message
    const userMessage = new ChatMessage({
      userId: req.user.id,
      message,
      sender: 'user',
      timestamp: new Date()
    });
    await userMessage.save();

    // Get AI response
    const aiResponse = await getAIResponse(message);

    // Save AI message
    const botMessage = new ChatMessage({
      userId: req.user.id,
      message: aiResponse,
      sender: 'bot',
      timestamp: new Date()
    });
    await botMessage.save();

    logger.info(`Chat message from user ${req.user.id}`);

    res.json({
      success: true,
      data: {
        userMessage,
        botMessage
      }
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Get chat history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await ChatMessage.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ChatMessage.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history'
    });
  }
});

// Delete chat message
router.delete('/:messageId', authMiddleware, async (req, res) => {
  try {
    const message = await ChatMessage.findOne({
      _id: req.params.messageId,
      userId: req.user.id
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await ChatMessage.deleteOne({ _id: req.params.messageId });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

export default router;