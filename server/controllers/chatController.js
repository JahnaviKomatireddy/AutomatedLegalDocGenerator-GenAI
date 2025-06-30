import Chat from '../models/Chat.js';
import { callGPT4All } from '../services/gptService.js'; // This will be dummy for now

export const askQuestion = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const aiReply = await callGPT4All(question); // placeholder
    console.log("🤖 AI Response:", aiReply);
    console.log("📝 Saving chat:", { userId: req.user.id, question, response: aiReply });

    const chat = await Chat.create({
      userId: req.user.id,
      question,
      response: aiReply
    });

    res.status(200).json({ reply: aiReply, chatId: chat._id });
  } catch (err) {
    res.status(500).json({ error: 'AI response failed', details: err.message });
  }
};
export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
};