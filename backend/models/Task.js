import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title too long']
  },
  description: {
    type: String,
    default: '',
    maxlength: [2000, 'Description too long']
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['academic', 'personal', 'health', 'social'],
    default: 'academic'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  estimatedDuration: {
    type: Number,
    default: 0 // in minutes
  },
  actualDuration: {
    type: Number,
    default: 0 // in minutes
  },
  subtasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.index({ userId: 1, dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;