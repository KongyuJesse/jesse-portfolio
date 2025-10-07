// middleware/upload-enhanced.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Profile picture storage
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/profile',
    format: async (req, file) => 'webp',
    transformation: [
      { width: 500, height: 500, crop: 'fill' },
      { quality: 'auto' }
    ],
    public_id: (req, file) => {
      return `profile-${Date.now()}`;
    }
  }
});

// Certificate storage
const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio/certificates',
    format: async (req, file) => 'webp',
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
      { quality: 'auto' }
    ],
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `certificate-${name}-${Date.now()}`;
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
export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for profile pictures
  }
});

export const uploadCertificate = multer({
  storage: certificateStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for certificates
  }
});

export const uploadResumeFile = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'portfolio/resumes',
      format: 'pdf',
      resource_type: 'raw',
      public_id: (req, file) => {
        return `resume-${Date.now()}`;
      }
    }
  }),
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for resumes
  }
});

export { cloudinary };