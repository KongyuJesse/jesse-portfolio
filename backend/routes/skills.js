// backend/routes/skills-enhanced.js
import express from 'express';
import Skill from '../models/Skill.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (featured) {
      filter.featured = featured === 'true';
    }
    
    const skills = await Skill.find(filter).sort({ order: 1, category: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update skills (protected) - Complete replacement
router.put('/', auth, async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    // Validate each skill
    for (const skill of skills) {
      if (!skill.name || !skill.category || typeof skill.level !== 'number') {
        return res.status(400).json({ 
          message: 'Each skill must have name, category, and level' 
        });
      }
      
      if (skill.level < 0 || skill.level > 100) {
        return res.status(400).json({ 
          message: 'Skill level must be between 0 and 100' 
        });
      }
    }

    // Delete all existing skills
    await Skill.deleteMany({});
    
    // Insert new skills with order
    const skillsWithOrder = skills.map((skill, index) => ({
      ...skill,
      order: index
    }));
    
    const newSkills = await Skill.insertMany(skillsWithOrder);
    res.json(newSkills);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create single skill (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, level, logo, featured } = req.body;
    
    if (!name || !category || level === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, category, level' 
      });
    }

    const skill = new Skill({
      name,
      category,
      level,
      logo: logo || '',
      featured: featured || false,
      order: 0
    });
    
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;