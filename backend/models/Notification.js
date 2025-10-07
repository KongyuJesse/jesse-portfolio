import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedEntity: {
    type: String,
    enum: ['project', 'certificate', 'message', 'system']
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);