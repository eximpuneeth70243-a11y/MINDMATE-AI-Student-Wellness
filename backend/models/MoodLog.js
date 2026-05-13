import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodScore: {
    type: Number,
    required: [true, 'Mood score is required'],
    min: [1, 'Mood score must be at least 1'],
    max: [10, 'Mood score cannot exceed 10']
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'stressed', 'motivated', 'tired', 'neutral'],
    default: 'neutral',
    required: true
  },
  notes: {
    type: String,
    default: '',
    maxlength: [1000, 'Notes too long']
  },
  triggers: [{
    type: String,
    enum: ['work', 'personal', 'health', 'social', 'other']
  }],
  activities: [{
    type: String,
    enum: ['exercise', 'meditation', 'sleep', 'socializing', 'studying', 'relaxation']
  }],
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  focusLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  }
});

moodLogSchema.index({ userId: 1, timestamp: -1 });

const MoodLog = mongoose.model('MoodLog', moodLogSchema);
export default MoodLog;