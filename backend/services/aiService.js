import axios from 'axios';
import logger from '../utils/logger.js';

let cachedAIResponse = null;

export const getAIResponse = async (userMessage) => {
  try {
    // Use OpenAI API
    if (process.env.OPENAI_API_KEY) {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are MINDMATE AI, a compassionate wellness assistant for students. Provide supportive, empathetic, and constructive responses focused on mental wellness, academic success, and personal growth.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    }

    // Fallback to Gemini API
    if (process.env.GEMINI_API_KEY) {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: userMessage
            }]
          }]
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    }

    // Fallback response
    logger.warn('No AI API configured, using default response');
    return 'I appreciate your message. Remember to take care of yourself. How can I support your wellness today?';
  } catch (error) {
    logger.error('AI Service error:', error);
    throw new Error('Failed to get AI response');
  }
};

export const analyzeMessageSentiment = async (message) => {
  try {
    // Simple sentiment analysis using keyword matching
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'amazing', 'wonderful'];
    const negativeWords = ['bad', 'sad', 'terrible', 'hate', 'awful', 'depressed', 'anxious'];

    const lowerMessage = message.toLowerCase();
    let sentiment = 0;

    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) sentiment += 0.2;
    });

    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) sentiment -= 0.2;
    });

    return Math.max(-1, Math.min(1, sentiment));
  } catch (error) {
    logger.error('Sentiment analysis error:', error);
    return 0;
  }
};