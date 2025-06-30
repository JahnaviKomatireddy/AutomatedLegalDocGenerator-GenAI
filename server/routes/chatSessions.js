import express from 'express';
import {ChatSession} from '../models/ChatSession.js';
import { verifyToken } from '../middleware/auth.js';
import { callGPT4All } from '../services/gptService.js';
import mongoose from 'mongoose';

const router = express.Router();


//POST /api/chats (create new chat)
router.post('/', verifyToken, async (req, res) => {
  console.log('🔐 Incoming Auth Header:', req.headers.authorization);
  console.log('🔍 req.user in POST /api/chats:', req.user);
  try {
      const newSession = new ChatSession({
      userId: new mongoose.Types.ObjectId(req.user.id),
      title: 'New Chat',
      messages: [],
    });

    const saved = await newSession.save();
    res.status(201).json(saved); 
  } catch (err) {
    console.error('❌ Error creating chat session:', err);
    res.status(500).json({ error: 'Failed to create session', details: err.message });
  }
});


//GET /api/chats (get all user chats)
router.get('/', verifyToken, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions', details: err.message });
  }
});


//GET /api/chats/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get session', details: err.message });
  }
});



//POST /api/chats/:id/message
router.post('/:id/message', verifyToken, async (req, res) => {
  const { text } = req.body;
  const sessionId = req.params.id;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ error: 'Invalid session ID format' });
  }

  try {
    const session = await ChatSession.findOne({ _id: sessionId, userId: req.user.id });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    //Add user message
    session.messages.push({ role: 'user', text });

    //Call GPT4All
    const botReply = await callGPT4All(text);

    //Add bot reply
    session.messages.push({ role: 'bot', text: botReply });

    //Rename if still default
   if (session.title === 'New Chat') {
  const newTitle = text.substring(0, 30);
  console.log('🟨 Renaming chat to:', newTitle);  
  session.title = newTitle;
  session.markModified('title'); 
}


    await session.save(); 
    console.log('Saved session with title:', session.title);

    res.status(200).json({ reply: botReply });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});



//PUT /api/chats/:id (rename session)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title } = req.body;
    const session = await ChatSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title },
      { new: true }
    );
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename session', details: err.message });
  }
});


// DELETE /api/chats/:id (delete session)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.status(200).json({ message: 'Chat session deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


export default router;
