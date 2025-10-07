import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'design', 'soft'],
    required: true
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Skill', skillSchema);