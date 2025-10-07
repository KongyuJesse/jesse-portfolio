// backend/routes/messages.js
import express from 'express';
import Message from '../models/Message.js';
import nodemailer from 'nodemailer';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create message with better error handling
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required: name, email, subject, message' 
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    const newMessage = new Message({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    await newMessage.save();

    // Send email notification (non-blocking)
    sendEmailNotification(newMessage).catch(error => {
      console.error('Email notification failed:', error);
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
    
  } catch (error) {
    console.error('Message creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error while sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all messages (protected)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single message (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark message as read (protected)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete message (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enhanced email notification function with better error handling and SSL fix
async function sendEmailNotification(message) {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Skipping email notification.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Fix for SSL certificate issue
      tls: {
        rejectUnauthorized: false
      },
      // Alternative configuration
      secure: false,
      requireTLS: true
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('Email server connection verified');

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: 'kongyujesse@gmail.com',
      subject: `📧 New Portfolio Message: ${message.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #64FFDA, #0A192F); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
                .message-box { background: white; padding: 15px; border-left: 4px solid #64FFDA; margin: 15px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 New Portfolio Message</h1>
                    <p>You have received a new message from your portfolio website</p>
                </div>
                <div class="content">
                    <h2>Message Details</h2>
                    <div class="message-box">
                        <p><strong>From:</strong> ${message.name}</p>
                        <p><strong>Email:</strong> ${message.email}</p>
                        <p><strong>Subject:</strong> ${message.subject}</p>
                        <p><strong>Date:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                    <h3>Message Content:</h3>
                    <div class="message-box">
                        <p>${message.message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="http://localhost:3000/admin#messages" style="background: #64FFDA; color: #0A192F; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            View in Admin Dashboard
                        </a>
                    </div>
                </div>
                <div class="footer">
                    <p>This email was sent automatically from your portfolio website.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent successfully:', result.messageId);
    
    // Mark message as notified
    await Message.findByIdAndUpdate(message._id, { notified: true });
    
  } catch (error) {
    console.error('❌ Failed to send email notification:', error.message);
    // Don't throw error here - we don't want email failures to break the message saving
  }
}

export default router;