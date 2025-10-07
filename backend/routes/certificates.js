// backend/routes/certificates-enhanced.js
import express from 'express';
import Certificate from '../models/Certificate.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    let filter = {};
    
    if (featured) {
      filter.featured = featured === 'true';
    }
    
    const certificates = await Certificate.find(filter).sort({ order: 1, issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create certificate (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, issuer, issueDate, image } = req.body;
    
    if (!name || !issuer || !issueDate || !image) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, issuer, issueDate, image' 
      });
    }

    const certificate = new Certificate({
      ...req.body,
      issueDate: new Date(issueDate)
    });
    
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update certificate (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, issuer, issueDate, image } = req.body;
    
    if (!name || !issuer || !issueDate || !image) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, issuer, issueDate, image' 
      });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        issueDate: new Date(issueDate)
      },
      { new: true, runValidators: true }
    );
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete certificate (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;