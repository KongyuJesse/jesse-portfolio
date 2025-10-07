// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters'],
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minLength: [5, 'Subject must be at least 5 characters'],
    maxLength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minLength: [10, 'Message must be at least 10 characters'],
    maxLength: [2000, 'Message cannot exceed 2000 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  replied: {
    type: Boolean,
    default: false
  },
  notified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Message', messageSchema);