import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import skillRoutes from './routes/skills.js';
import certificateRoutes from './routes/certificates.js';
import messageRoutes from './routes/messages.js';
import aboutRoutes from './routes/about.js';
import resumeRoutes from './routes/resume.js';
import uploadRoutes from './routes/upload.js';
import notificationRoutes from './routes/notifications.js';
import newsletterRoutes from './routes/newsletter.js';
import contentRoutes from './routes/content.js';

// Import models
import User from './models/User.js';
import About from './models/About.js';

const app = express();

// ✅ Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIX: Better trust proxy configuration for Render
app.set('trust proxy', 1);

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('💡 Please check your .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ FIX: Updated CORS configuration - More permissive for Vercel
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000', 
  'http://localhost:5173',
  'https://jesse-portfolio-wslg.onrender.com',
  'https://jesse-portfolio-kf1b.vercel.app',
  'https://jesse-portfolio-kf1b-*.vercel.app', // Pattern for Vercel preview deployments
  'https://*.vercel.app' // Allow all Vercel deployments
];

// Add environment variable origins if specified
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}

console.log('🛡️ Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      console.log('🔓 Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Allowed CORS for: ${origin}`);
      return callback(null, true);
    }
    
    // Check for Vercel pattern matching
    if (origin.endsWith('.vercel.app')) {
      console.log(`✅ Allowed Vercel deployment: ${origin}`);
      return callback(null, true);
    }
    
    console.log(`❌ Blocked by CORS: ${origin}`);
    console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`);
    
    // For development, you might want to be more permissive
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Development mode: Allowing origin despite CORS');
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ FIX: Explicitly handle preflight requests
app.options('*', cors());

// ✅ FIX: Simple rate limiting without proxy issues
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 1000,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use the client's real IP address even behind proxy
    return req.ip;
  }
});

app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/content', contentRoutes);

// ✅ FIX: Serve static files from build directory (if exists)
app.use(express.static(path.join(__dirname, '../dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    cors: {
      enabled: true,
      allowedOrigins: allowedOrigins
    }
  });
});

// ✅ FIX: API test endpoint with CORS info
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    origin: req.get('origin') || 'No origin header',
    cors: 'CORS should be enabled for this endpoint'
  });
});

// ✅ FIX: Enhanced CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  const origin = req.get('origin');
  res.json({
    message: 'CORS Test Endpoint',
    yourOrigin: origin,
    corsStatus: allowedOrigins.includes(origin) ? 'ALLOWED' : 'BLOCKED',
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// ✅ FIX: Catch-all handler for React SPA - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't handle API routes with SPA
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      message: 'API endpoint not found',
      path: req.path,
      availableEndpoints: [
        '/api/health',
        '/api/test',
        '/api/cors-test',
        '/api/auth/login',
        '/api/projects',
        '/api/skills',
        '/api/about',
        '/api/content'
      ]
    });
  }
  
  // For all other routes, this should be handled by your frontend
  res.json({
    message: 'Backend server is running',
    note: 'This is the backend API. Frontend should be served separately.',
    frontendUrl: 'https://jesse-portfolio-kf1b.vercel.app',
    backendUrl: 'https://jesse-portfolio-wslg.onrender.com',
    availableEndpoints: [
      '/api/health',
      '/api/test',
      '/api/cors-test',
      '/api/auth/login',
      '/api/projects',
      '/api/skills',
      '/api/about',
      '/api/content'
    ]
  });
});

// Initialize default data
const initializeData = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if admin user exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Check if about content exists
    const aboutExists = await About.findOne();
    if (!aboutExists) {
      const aboutContent = new About({
        title: 'About Me',
        description: 'Visionary technologist passionate about building scalable solutions',
        bio: 'I am a purpose-driven technologist passionate about building scalable, AI-driven solutions that create real impact.',
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
          }
        ]
      });
      await aboutContent.save();
      console.log('✅ About content initialized');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: https://jesse-portfolio-wslg.onrender.com/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 API Base URL: https://jesse-portfolio-wslg.onrender.com`);
  console.log(`🎯 Frontend URL: https://jesse-portfolio-kf1b.vercel.app`);
  console.log(`🛡️ CORS Enabled for: ${allowedOrigins.join(', ')}`);
  
  // Initialize data after server starts
  await initializeData();
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down backend server...');
  await mongoose.connection.close();
  process.exit(0);
});