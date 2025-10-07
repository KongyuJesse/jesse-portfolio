import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Resume', resumeSchema);