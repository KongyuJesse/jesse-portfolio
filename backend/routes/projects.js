import express from 'express';
import Project from '../models/Project.js';
import Newsletter from '../models/Newsletter.js';
import auth from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Enhanced email configuration with timeout and retries
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  secure: false,
  requireTLS: true,
  // Increased timeout settings
  connectionTimeout: 90000, // 90 seconds
  greetingTimeout: 90000,   // 90 seconds
  socketTimeout: 120000,    // 120 seconds
  // Retry configuration
  maxConnections: 5,
  maxRetries: 5
};

// Enhanced function to send project notification to subscribers with retry logic
async function sendProjectNotification(project) {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Skipping project notification.');
    return;
  }

  try {
    // Get all active subscribers
    const subscribers = await Newsletter.find({ subscribed: true });
    
    if (subscribers.length === 0) {
      console.log('No subscribers to notify');
      return;
    }

    console.log(`📧 Preparing to send project notification to ${subscribers.length} subscribers...`);

    // Send to each subscriber with individual retry logic
    for (const subscriber of subscribers) {
      let retries = 5;
      let sentSuccessfully = false;

      while (retries > 0 && !sentSuccessfully) {
        try {
          console.log(`📧 Attempting to send project notification to ${subscriber.email} (${6 - retries}/5)...`);

          const transporter = nodemailer.createTransporter(emailConfig);

          // Verify connection with timeout
          await Promise.race([
            transporter.verify(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Email verification timeout after 90s')), 90000)
            )
          ]);

          const mailOptions = {
            from: `"Kongyu Jesse Portfolio" <${process.env.EMAIL_USER}>`,
            to: subscriber.email,
            subject: `🚀 New Project: ${project.title}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                  <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .header { background: linear-gradient(135deg, #64FFDA, #0A192F); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                      .content { background: #f9f9f9; padding: 25px; border-radius: 0 0 10px 10px; }
                      .project-image { width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 15px 0; }
                      .project-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
                      .cta-button { display: inline-block; background: #64FFDA; color: #0A192F; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
                      .footer { text-align: center; margin-top: 25px; color: #666; font-size: 12px; }
                      .unsubscribe { text-align: center; margin-top: 15px; font-size: 12px; color: #999; }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <div class="header">
                          <h1>🎉 New Project Alert!</h1>
                          <p>I've just launched a new project</p>
                      </div>
                      <div class="content">
                          <h2>${project.title}</h2>
                          
                          ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image">` : ''}
                          
                          <div class="project-details">
                              <p><strong>Description:</strong> ${project.shortDescription || project.description}</p>
                              
                              ${project.technologies && project.technologies.length > 0 ? `
                              <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
                              ` : ''}
                              
                              ${project.category ? `
                              <p><strong>Category:</strong> ${project.category}</p>
                              ` : ''}
                          </div>

                          <div style="text-align: center; margin: 20px 0;">
                              ${project.liveUrl ? `
                              <a href="${project.liveUrl}" class="cta-button" target="_blank">🌐 Live Demo</a>
                              ` : ''}
                              
                              ${project.githubUrl ? `
                              <a href="${project.githubUrl}" class="cta-button" style="background: #333; color: white;" target="_blank">💻 View Code</a>
                              ` : ''}
                              
                              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}#projects" class="cta-button" style="background: #0A192F; color: white;">📂 View All Projects</a>
                          </div>

                          <p>Thank you for being part of my journey! I hope you find this project interesting.</p>
                          
                          <p>Best regards,<br><strong>Kongyu Jesse Ntani</strong></p>
                      </div>
                      
                      <div class="unsubscribe">
                          <p>
                              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?token=${subscriber.unsubscribeToken}" style="color: #666; text-decoration: none;">
                                  Unsubscribe from these notifications
                              </a>
                          </p>
                      </div>
                      
                      <div class="footer">
                          <p>This email was sent to ${subscriber.email} because you subscribed to updates from my portfolio.</p>
                      </div>
                  </div>
              </body>
              </html>
            `
          };

          // Send email with timeout
          await Promise.race([
            transporter.sendMail(mailOptions),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Email sending timeout after 90s')), 90000)
            )
          ]);

          console.log('✅ Project notification sent to:', subscriber.email);
          sentSuccessfully = true;
          
        } catch (error) {
          retries--;
          
          if (retries > 0) {
            console.warn(`❌ Project notification attempt failed for ${subscriber.email} (${5 - retries}/5). Retrying in 10 seconds...`, error.message);
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 10000 * (5 - retries)));
          } else {
            console.error(`❌ All project notification attempts failed for ${subscriber.email}:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ Project notification process completed');
    
  } catch (error) {
    console.error('❌ Failed to send project notifications:', error.message);
  }
}

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { category, featured, status } = req.query;
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured) {
      filter.featured = featured === 'true';
    }
    
    if (status) {
      filter.status = status;
    }
    
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project (protected)
router.post('/', auth, async (req, res) => {
  try {
    // Validate required fields
    const { title, description, shortDescription, image, githubUrl } = req.body;
    
    if (!title || !description || !shortDescription || !image || !githubUrl) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, shortDescription, image, githubUrl' 
      });
    }

    // Validate status
    const validStatuses = ['completed', 'in-progress', 'planned'];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: completed, in-progress, planned' 
      });
    }

    const project = new Project({
      ...req.body,
      status: req.body.status || 'in-progress' // Default to in-progress
    });
    
    await project.save();
    
    // Send notifications to subscribers with enhanced retry logic (non-blocking)
    sendProjectNotification(project).catch(error => {
      console.error('Project notification failed after all retries:', error);
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update project (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { githubUrl, status } = req.body;
    
    if (!githubUrl) {
      return res.status(400).json({ 
        message: 'GitHub URL is required' 
      });
    }

    // Validate status
    const validStatuses = ['completed', 'in-progress', 'planned'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: completed, in-progress, planned' 
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete project (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project order (protected)
router.patch('/order', auth, async (req, res) => {
  try {
    const { projects } = req.body;
    
    const bulkOps = projects.map((project, index) => ({
      updateOne: {
        filter: { _id: project._id },
        update: { $set: { order: index } }
      }
    }));
    
    await Project.bulkWrite(bulkOps);
    res.json({ message: 'Project order updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
