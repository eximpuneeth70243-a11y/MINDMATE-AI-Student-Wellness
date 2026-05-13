import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: [
      'study_routine',
      'meditation',
      'breathing',
      'sleep_improvement',
      'stress_reduction',
      'productivity',
      'social',
      'emergency_support'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  duration: {
    type: Number,
    default: 0 // in minutes
  },
  instructions: [String],
  resources: [{
    type: String,
    url: String
  }],
  relevanceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  userFeedback: {
    type: Boolean,
    default: null
  },
  feedbackDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
});

recommendationSchema.index({ userId: 1, expiresAt: 1 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;