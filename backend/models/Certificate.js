import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  credentialUrl: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Certificate', certificateSchema);