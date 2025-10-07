import mongoose from 'mongoose';
import crypto from 'crypto';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subscribed: {
    type: Boolean,
    default: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  unsubscribeToken: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate unsubscribe token before saving
newsletterSchema.pre('save', function(next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

export default mongoose.model('Newsletter', newsletterSchema);