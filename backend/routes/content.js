// routes/content.js
import express from 'express';
import Content from '../models/Content.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) {
      // Create default content if none exists
      const defaultContent = new Content({
        hero: {
          title: "Kongyu Jesse Ntani",
          subtitle: "Full Stack Developer",
          description: "Visionary technologist crafting scalable, AI-driven solutions"
        },
        about: {
          title: "About Me",
          description: "Purpose-driven technologist passionate about building scalable solutions",
          bio: "I am a purpose-driven technologist passionate about building scalable, AI-driven solutions that create real impact.",
          image: "/images/profile.jpg"
        },
        contact: {
          email: "kongyujesse@gmail.com",
          socialLinks: {
            linkedin: "https://linkedin.com/in/kongyujesse",
            github: "https://github.com/kongyujesse",
            twitter: "https://twitter.com/kongyujesse"
          }
        }
      });
      await defaultContent.save();
      return res.json(defaultContent);
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update content
router.put('/', auth, async (req, res) => {
  try {
    let content = await Content.findOne();
    
    if (!content) {
      content = new Content(req.body);
    } else {
      content = await Content.findOneAndUpdate(
        {},
        { $set: req.body },
        { new: true, runValidators: true }
      );
    }
    
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;