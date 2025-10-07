// backend/routes/upload-enhanced.js
import express from 'express';
import auth from '../middleware/auth.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage configurations
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/images',
    format: async () => 'webp',
    transformation: [
      { quality: 'auto', fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `img-${name}-${Date.now()}`;
    }
  }
});

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/profile',
    format: async () => 'webp',
    transformation: [
      { width: 500, height: 500, crop: 'fill' },
      { quality: 'auto' }
    ],
    public_id: () => `profile-${Date.now()}`
  }
});

const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/certificates',
    format: async () => 'webp',
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
      { quality: 'auto' }
    ],
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `cert-${name}-${Date.now()}`;
    }
  }
});

const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/documents',
    resource_type: 'raw',
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `doc-${name}-${Date.now()}`;
    }
  }
});

// File filters
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Multer instances
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

const uploadCertificate = multer({
  storage: certificateStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();

// Upload project image
router.post('/image', auth, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    res.json({
      message: 'Image uploaded successfully',
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile picture
router.post('/profile', auth, uploadProfile.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    res.json({
      message: 'Profile image uploaded successfully',
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload certificate image
router.post('/certificate', auth, uploadCertificate.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    res.json({
      message: 'Certificate image uploaded successfully',
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload resume
router.post('/resume', auth, uploadDocument.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file provided' });
    }

    res.json({
      message: 'Resume uploaded successfully',
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete file
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;