import express from 'express';
import Chat from '../models/Chat.js';
import  { verifyToken } from '../middleware/auth.js';


const router = express.Router();

// Get all sessions for the logged-in user
router.get('/sessions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await Chat.find({ user: userId }).sort({ createdAt: -1 });

    // Optional: structure it with session titles or timestamps
    const formatted = sessions.map((session) => ({
      id: session._id,
      question: session.question,
      response: session.response,
      createdAt: session.createdAt,
    }));

    res.json(sessions);
  } catch (err) {
    console.error('❌ Session fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
