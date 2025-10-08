import express from 'express';
import Resume from '../models/Resume.js';
import auth from '../middleware/auth.js';
import { uploadResumeFile } from '../middleware/upload.js';

const router = express.Router();

// Get active resume
router.get('/', async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true });
    if (!resume) {
      return res.status(404).json({ message: 'No active resume found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all resumes (protected)
router.get('/all', auth, async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload resume (protected) - Accept both file upload and direct data
router.post('/', auth, uploadResumeFile.single('resume'), async (req, res) => {
  try {
    // If file was uploaded via middleware
    if (req.file) {
      const resume = new Resume({
        title: req.body.title || 'Professional Resume',
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        fileSize: req.file.size,
        version: req.body.version || '1.0',
        description: req.body.description || 'Professional Resume',
        isActive: false
      });

      await resume.save();
      return res.status(201).json(resume);
    }
    
    // If resume data is sent directly (for already uploaded files)
    if (req.body.fileUrl) {
      const resume = new Resume({
        title: req.body.title,
        fileName: req.body.fileName,
        fileUrl: req.body.fileUrl,
        fileSize: req.body.fileSize,
        version: req.body.version || '1.0',
        description: req.body.description || 'Professional Resume',
        isActive: false
      });

      await resume.save();
      return res.status(201).json(resume);
    }

    return res.status(400).json({ message: 'No resume file or file data provided' });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Activate resume (protected)
router.patch('/:id/activate', auth, async (req, res) => {
  try {
    // Deactivate all resumes
    await Resume.updateMany({}, { isActive: false });
    
    // Activate the selected resume
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete resume (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (resume.isActive) {
      return res.status(400).json({ message: 'Cannot delete active resume' });
    }
    
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;