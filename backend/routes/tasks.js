import express from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const task = new Task({
      userId: req.user.id,
      title,
      description: description || '',
      dueDate: dueDate || new Date(),
      priority: priority || 'medium'
    });

    await task.save();
    logger.info(`Task created for user ${req.user.id}: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
});

// Get user tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const query = { userId: req.user.id };

    if (status !== 'all') {
      query.completed = status === 'completed';
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks'
    });
  }
});

// Update task
router.put('/:taskId', authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, priority, completed } = req.body;

    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (typeof completed === 'boolean') task.completed = completed;

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    logger.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

// Delete task
router.delete('/:taskId', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.deleteOne({ _id: req.params.taskId });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
});

export default router;