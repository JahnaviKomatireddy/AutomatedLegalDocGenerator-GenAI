import ChatSession from '../models/ChatSession.js';

export const getAllChats = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
};

export const createChat = async (req, res) => {
  try {
    const newSession = new ChatSession({
      user: req.userId,
      title: 'New Chat',
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat session' });
  }
};
