import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
},{ _id: false });

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, default: 'New Chat' },
  messages: [
    {
      role: { type: String, enum: ['user', 'bot'], required: true },
      text: { type: String, required: true },
    }
  ]
}, { timestamps: true });
 // ⬅️ Ensures createdAt and updatedAt fields

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);