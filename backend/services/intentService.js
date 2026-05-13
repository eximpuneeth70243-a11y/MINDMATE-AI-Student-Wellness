import ChatMessage from '../models/ChatMessage.js';
import logger from '../utils/logger.js';

const intentPatterns = {
  academic_stress: ['exam', 'assignment', 'test', 'deadline', 'study', 'class', 'homework'],
  time_management: ['time', 'busy', 'schedule', 'organize', 'manage', 'plan'],
  emotional_wellbeing: ['feel', 'mood', 'emotion', 'happy', 'sad', 'stressed', 'anxious'],
  social_interaction: ['friend', 'relationship', 'social', 'lonely', 'people', 'community'],
  productivity: ['productive', 'focus', 'concentrate', 'work', 'progress', 'goal'],
  motivation: ['motivate', 'inspired', 'passion', 'drive', 'enthusiasm', 'excited']
};

export const classifyIntent = (message) => {
  try {
    const lowerMessage = message.toLowerCase();
    let maxMatches = 0;
    let detectedIntent = 'general_chat';

    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedIntent = intent;
      }
    }

    return detectedIntent;
  } catch (error) {
    logger.error('Intent classification error:', error);
    return 'general_chat';
  }
};

export const detectEmotion = (message) => {
  try {
    const emotionKeywords = {
      happy: ['happy', 'joy', 'great', 'wonderful', 'excellent', 'love'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable'],
      anxious: ['anxious', 'nervous', 'worried', 'panic', 'fear'],
      stressed: ['stressed', 'overwhelmed', 'pressure', 'tense'],
      motivated: ['motivated', 'inspired', 'excited', 'energized'],
      tired: ['tired', 'exhausted', 'fatigue', 'sleepy', 'worn out'],
      neutral: ['ok', 'fine', 'alright', 'normal']
    };

    const lowerMessage = message.toLowerCase();
    let detectedEmotion = 'neutral';
    let maxMatches = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    }

    return detectedEmotion;
  } catch (error) {
    logger.error('Emotion detection error:', error);
    return 'neutral';
  }
};