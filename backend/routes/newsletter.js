import express from 'express';
import Newsletter from '../models/Newsletter.js';
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

// Enhanced email function for newsletter with retry logic
async function sendWelcomeEmail(subscriber) {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Skipping welcome email.');
    return;
  }

  let retries = 5;
  let lastError = null;

  while (retries > 0) {
    try {
      console.log(`📧 Attempting to send welcome email (${6 - retries}/5)...`);

      const transporter = nodemailer.createTransport(emailConfig);

      // Verify connection with timeout
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email verification timeout after 90s')), 90000)
        )
      ]);

      const unsubscribeLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?token=${subscriber.unsubscribeToken}`;

      const mailOptions = {
        from: `"Kongyu Jesse Portfolio" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject: '🎉 Welcome to My Newsletter!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #64FFDA, #0A192F); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .welcome-text { font-size: 18px; margin-bottom: 20px; }
                  .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .feature-item { margin: 10px 0; padding-left: 20px; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                  .unsubscribe { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>🚀 Welcome Aboard!</h1>
                      <p>Thank you for subscribing to my newsletter</p>
                  </div>
                  <div class="content">
                      <div class="welcome-text">
                          <p>Hello,</p>
                          <p>Thank you for subscribing to my newsletter! I'm excited to have you on board.</p>
                      </div>
                      
                      <div class="features">
                          <h3>What to expect:</h3>
                          <div class="feature-item">📧 <strong>Project Updates:</strong> Get notified when I launch new projects</div>
                          <div class="feature-item">💡 <strong>Tech Insights:</strong> Latest trends and technologies I'm working with</div>
                          <div class="feature-item">🎯 <strong>Tips & Tutorials:</strong> Valuable content to help you in your journey</div>
                          <div class="feature-item">🚀 <strong>Career Updates:</strong> My latest achievements and learnings</div>
                      </div>

                      <p>I'll be sending updates periodically with my latest work, insights, and occasional tips about web development and technology.</p>
                      
                      <p>If you have any questions or just want to say hello, feel free to reply to this email!</p>
                      
                      <p>Best regards,<br><strong>Kongyu Jesse Ntani</strong></p>
                  </div>
                  
                  <div class="unsubscribe">
                      <p>
                          <a href="${unsubscribeLink}" style="color: #666; text-decoration: none;">
                              Unsubscribe from these emails
                          </a>
                      </p>
                  </div>
                  
                  <div class="footer">
                      <p>This email was sent automatically from my portfolio website.</p>
                  </div>
              </div>
          </body>
          </html>
        `
      };

      // Send email with timeout
      const result = await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email sending timeout after 90s')), 90000)
        )
      ]);
      
      console.log('✅ Welcome email sent successfully to:', subscriber.email);
      return;
      
    } catch (error) {
      lastError = error;
      retries--;
      
      if (retries > 0) {
        console.warn(`❌ Welcome email attempt failed (${5 - retries}/5). Retrying in 10 seconds...`, error.message);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 10000 * (5 - retries)));
      } else {
        console.error('❌ All welcome email attempts failed:', error.message);
      }
    }
  }

  // If we get here, all retries failed
  console.error('💥 Final welcome email failure after 5 attempts:', lastError?.message);
}

// Subscribe to newsletter - FIXED DUPLICATE HANDLING
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed with better error handling
    const existingSubscriber = await Newsletter.findOne({ email: normalizedEmail });
    if (existingSubscriber) {
      if (existingSubscriber.subscribed) {
        return res.status(409).json({ 
          message: 'This email is already subscribed to our newsletter',
          code: 'ALREADY_SUBSCRIBED'
        });
      } else {
        // Resubscribe
        existingSubscriber.subscribed = true;
        existingSubscriber.subscriptionDate = new Date();
        await existingSubscriber.save();
        
        // Send welcome email with enhanced retry logic (non-blocking)
        sendWelcomeEmail(existingSubscriber).catch(error => {
          console.error('Welcome email failed after all retries:', error);
        });
        
        return res.json({ 
          message: 'Successfully resubscribed to our newsletter!',
          subscriber: {
            email: existingSubscriber.email,
            subscriptionDate: existingSubscriber.subscriptionDate
          }
        });
      }
    }

    // Create new subscriber
    const subscriber = new Newsletter({
      email: normalizedEmail
    });

    await subscriber.save();
    
    // Send welcome email with enhanced retry logic (non-blocking)
    sendWelcomeEmail(subscriber).catch(error => {
      console.error('Welcome email failed after all retries:', error);
    });

    res.status(201).json({
      message: 'Successfully subscribed to our newsletter!',
      subscriber: {
        email: subscriber.email,
        subscriptionDate: subscriber.subscriptionDate
      }
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'This email is already subscribed',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while processing subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token && !email) {
      return res.status(400).json({ 
        message: 'Unsubscribe token or email is required' 
      });
    }

    let subscriber;
    if (token) {
      subscriber = await Newsletter.findOne({ unsubscribeToken: token });
    } else if (email) {
      subscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    }

    if (!subscriber) {
      return res.status(404).json({ 
        message: 'Subscriber not found' 
      });
    }

    subscriber.subscribed = false;
    await subscriber.save();

    res.json({ 
      message: 'Successfully unsubscribed from our newsletter' 
    });
    
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ 
      message: 'Server error while processing unsubscribe' 
    });
  }
});

// Get all subscribers (protected)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ subscribed: true }).sort({ subscriptionDate: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get subscriber count
router.get('/count', async (req, res) => {
  try {
    const count = await Newsletter.countDocuments({ subscribed: true });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
