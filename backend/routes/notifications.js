import express from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user notifications (protected)
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read (protected)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark all notifications as read (protected)
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notification (internal use)
router.post('/', auth, async (req, res) => {
  try {
    const notification = new Notification({
      ...req.body,
      userId: req.userId
    });
    
    await notification.save();
    
    // Emit real-time notification (if using Socket.io)
    // req.app.get('io').to(req.userId).emit('notification', notification)
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;