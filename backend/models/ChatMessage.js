import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [1, 'Message cannot be empty'],
    maxlength: [5000, 'Message too long']
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  sentiment: {
    score: {
      type: Number,
      default: 0,
      min: -1,
      max: 1
    },
    label: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    }
  },
  intent: {
    type: String,
    enum: [
      'academic_stress',
      'time_management',
      'emotional_wellbeing',
      'social_interaction',
      'productivity',
      'motivation',
      'general_chat'
    ],
    default: 'general_chat'
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'stressed', 'motivated', 'tired', 'neutral'],
    default: 'neutral'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

chatMessageSchema.index({ userId: 1, timestamp: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;