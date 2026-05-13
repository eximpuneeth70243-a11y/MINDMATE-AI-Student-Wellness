import MoodLog from '../models/MoodLog.js';
import Task from '../models/Task.js';
import Recommendation from '../models/Recommendation.js';
import logger from '../utils/logger.js';

const wellnessRecommendations = [
  {
    title: 'Morning Meditation',
    description: 'Start your day with a 10-minute guided meditation to center yourself',
    category: 'meditation',
    duration: 10,
    priority: 'high'
  },
  {
    title: 'Study Break Exercise',
    description: 'Take a 5-minute walk or do some stretching after every 25 minutes of study',
    category: 'productivity',
    duration: 5,
    priority: 'medium'
  },
  {
    title: 'Box Breathing Exercise',
    description: 'Practice 4-4-4-4 breathing to reduce anxiety and stress',
    category: 'breathing',
    duration: 5,
    priority: 'high'
  },
  {
    title: 'Sleep Hygiene Tips',
    description: 'Maintain a consistent sleep schedule and avoid screens 30 minutes before bed',
    category: 'sleep_improvement',
    duration: 0,
    priority: 'high'
  },
  {
    title: 'Pomodoro Technique',
    description: 'Use the Pomodoro method: 25 minutes focus, 5 minutes break',
    category: 'productivity',
    duration: 25,
    priority: 'medium'
  }
];

export const getRecommendations = async (userId) => {
  try {
    // Get user's recent mood data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMoods = await MoodLog.find({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    });

    // Get user's pending tasks
    const pendingTasks = await Task.find({
      userId,
      completed: false,
      dueDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    const recommendations = [];

    // Determine recommendations based on mood
    if (recentMoods.length > 0) {
      const avgMood = recentMoods.reduce((sum, log) => sum + log.moodScore, 0) / recentMoods.length;

      if (avgMood < 4) {
        // Low mood - suggest calming activities
        recommendations.push(wellnessRecommendations[0]); // Meditation
        recommendations.push(wellnessRecommendations[2]); // Breathing
      } else if (avgMood > 7) {
        // High mood - maintain it
        recommendations.push(wellnessRecommendations[1]); // Study Break
      }
    }

    // Determine recommendations based on tasks
    if (pendingTasks.length > 5) {
      recommendations.push(wellnessRecommendations[4]); // Pomodoro
    }

    // Always suggest sleep hygiene
    recommendations.push(wellnessRecommendations[3]);

    // Save recommendations to database
    for (const rec of recommendations) {
      await Recommendation.findOneAndUpdate(
        { userId, title: rec.title },
        { ...rec, userId, relevanceScore: Math.random() * 100 },
        { upsert: true, new: true }
      );
    }

    return recommendations.slice(0, 5);
  } catch (error) {
    logger.error('Get recommendations error:', error);
    return wellnessRecommendations.slice(0, 3);
  }
};