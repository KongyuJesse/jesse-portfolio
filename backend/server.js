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

// Import models
import User from './models/User.js';
import About from './models/About.js';

const app = express();

// ✅ Trust proxy for correct IP detection behind Render/Heroku/etc
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

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

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Rate limiting (after trust proxy is set)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false
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

// Initialize default data
const initializeData = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Admin user
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
      const isMatch = await adminExists.comparePassword(adminPassword);
      if (!isMatch) {
        console.log('⚠️  Password mismatch. Updating password...');
        adminExists.password = adminPassword;
        await adminExists.save();
        console.log('✅ Password updated');
      }
    }

    // About content
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
          { title: 'Frontend Development', description: 'Modern React applications with responsive design', icon: '💻' },
          { title: 'Backend Development', description: 'Scalable Node.js and Python backend systems', icon: '⚙️' },
          { title: 'UI/UX Design', description: 'User-centered design with Figma and prototyping', icon: '🎨' }
        ]
      });
      await aboutContent.save();
      console.log('✅ About content initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    enhancedRoutes: {
      projects: true,
      skills: true,
      certificates: true,
      upload: true,
      newsletter: true
    }
  });
});

// Handle preflight requests
app.options('*', cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize data after server starts
  await initializeData();
  
  console.log(`🔑 Admin login: ${process.env.ADMIN_EMAIL}`);
  console.log(`✨ Enhanced routes loaded: Projects, Skills, Certificates, Upload, Newsletter`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down backend server...');
  await mongoose.connection.close();
  process.exit(0);
});
