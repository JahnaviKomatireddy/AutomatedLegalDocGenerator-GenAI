// pages/api/chats/index.js
import connectDB from '../../../lib/mongodb';
import Chat from '../../../models/Chat';
import authMiddleware from '../../../middleware/auth';

export default authMiddleware(async (req, res) => {
  await connectDB();

  const userId = req.user.id;

  if (req.method === 'GET') {
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json(chats);
  }

  if (req.method === 'POST') {
    const newChat = await Chat.create({
      title: 'New Chat',
      userId,
      messages: [],
    });
    return res.status(201).json(newChat);
  }

  return res.status(405).json({ error: 'Method not allowed' });
});
