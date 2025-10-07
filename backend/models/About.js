import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  stats: [{
    label: String,
    value: String,
    icon: String
  }],
  services: [{
    title: String,
    description: String,
    icon: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('About', aboutSchema);