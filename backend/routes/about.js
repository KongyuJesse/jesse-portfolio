import express from 'express';
import About from '../models/About.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get about content
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      // Create default about content if none exists
      about = new About({
        title: 'About Me',
        description: 'Visionary technologist passionate about building scalable solutions',
        bio: 'I am a purpose-driven technologist passionate about building scalable, AI-driven solutions that create real impact. With a keen eye for design and robust engineering principles, I bridge the gap between visionary ideas and production-ready products.',
        image: '/images/profile.jpg',
        resume: '/documents/resume.pdf',
        stats: [
          { label: 'Projects Completed', value: '50+', icon: '🚀' },
          { label: 'Years Experience', value: '3+', icon: '💼' },
          { label: 'Happy Clients', value: '30+', icon: '😊' }
        ],
        services: [
          {
            title: 'Frontend Development',
            description: 'Modern React applications with responsive design',
            icon: '💻'
          },
          {
            title: 'Backend Development',
            description: 'Scalable Node.js and Python backend systems',
            icon: '⚙️'
          },
          {
            title: 'UI/UX Design',
            description: 'User-centered design with Figma and prototyping',
            icon: '🎨'
          }
        ]
      });
      await about.save();
    }
    
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update about content (protected)
router.put('/', auth, async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = new About(req.body);
    } else {
      about = await About.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    }
    
    await about.save();
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;