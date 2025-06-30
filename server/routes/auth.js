import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

//Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

//Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

//Forgot Password (SendGrid)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 15 * 60 * 1000; 
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
  
    const savedUser = await User.findOne({ email });
     console.log('📦 Saved User:', savedUser);

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Reset Your Password',
      html: `
        <h2>Reset Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color:#4f46e5;">Reset your password here</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    //Send email
    await sgMail.send(msg);
    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('Forgot Password Error:', err.response?.body || err.message);
    res.status(500).json({ error: 'Failed to send reset link', details: err.message });
  }
});

//Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
   

    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() },
    });

    console.log('🔍 Matched User:', user);

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    console.log('Password Updated');
    res.json({ message: 'Password reset successful' });

  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
