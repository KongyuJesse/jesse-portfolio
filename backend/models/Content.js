import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    typingTexts: [{ type: String }]
  },
  about: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
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
  },
  contact: {
    email: { type: String, required: true },
    location: String,
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      email: String
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Ensure only one content document exists
contentSchema.statics.getContent = async function() {
  let content = await this.findOne();
  if (!content) {
    content = await this.create({});
  }
  return content;
};

export default mongoose.model('Content', contentSchema);