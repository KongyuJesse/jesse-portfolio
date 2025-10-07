// server.js (Complete)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

// ✅ FIX: Better trust proxy configuration for Render
app.set('trust proxy', 1); // Trust first proxy only

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

// ✅ FIX: Updated CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000', 
      'http://localhost:5173',
      'https://jesse-portfolio-kf1b-ki3mukjr4-kongyu-jesse-ntanis-projects.vercel.app/',
      'https://jesse-portfolio-wslg.onrender.com'
    ];
    
    // Add any custom domains from environment variable
    if (process.env.ALLOWED_ORIGINS) {
      allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ FIX: Explicitly handle preflight requests
app.options('*', cors());

// ✅ FIX: Updated Rate limiting with proper proxy configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: message,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
      // Use the client's real IP address even behind proxy
      return req.ip;
    },
    handler: (req, res) => {
      res.status(429).json({
        message: message,
        retryAfter: Math.ceil(windowMs / 1000),
        limit: max,
        window: Math.ceil(windowMs / 1000 / 60) + ' minutes'
      });
    }
  });
};

// Different rate limits for different endpoints
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX) || 1000, // requests per window
  'Too many requests from this IP, please try again later.'
);

const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 login attempts per 15 minutes
  'Too many authentication attempts, please try again later.'
);

const messageLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  5, // 5 messages per hour
  'Message limit exceeded, please try again later.'
);

const newsletterLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 subscription attempts per hour
  'Too many subscription attempts, please try again later.'
);

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/messages', messageLimiter);
app.use('/api/newsletter/subscribe', newsletterLimiter);

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
      
      // Verify the password works
      const testUser = await User.findOne({ email: adminEmail });
      const isMatch = await testUser.comparePassword(adminPassword);
      console.log('🔐 Password verification test:', isMatch ? '✅ SUCCESS' : '❌ FAILED');
    } else {
      console.log('✅ Admin user already exists');
      
      // Test the existing user's password
      const isMatch = await adminExists.comparePassword(adminPassword);
      console.log('🔐 Password verification test:', isMatch ? '✅ SUCCESS' : '❌ FAILED');
      
      if (!isMatch) {
        console.log('⚠️  Password mismatch. Updating password...');
        adminExists.password = adminPassword;
        await adminExists.save();
        console.log('✅ Password updated');
      }
    }

    // Check if about content exists
    const aboutExists = await About.findOne();
    if (!aboutExists) {
      const aboutContent = new About({
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
      await aboutContent.save();
      console.log('✅ Default about content created');
    }

    console.log('✅ Data initialization completed');
  } catch (error) {
    console.error('❌ Data initialization error:', error);
  }
};

// Initialize data on server start
initializeData();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio API Server', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      skills: '/api/skills',
      certificates: '/api/certificates',
      messages: '/api/messages',
      about: '/api/about',
      resume: '/api/resume'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});