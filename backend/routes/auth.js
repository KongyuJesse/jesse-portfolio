import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', user.email);

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('🔑 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', email);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add token verification endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

export default router;