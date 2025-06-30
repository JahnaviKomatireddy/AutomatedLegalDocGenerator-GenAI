import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import chatSessionsRoutes from './routes/chatSessions.js';

dotenv.config();

const app = express();
app.use(cors({
   origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chats', chatSessionsRoutes);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
   dbName: 'chatbot'
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB Atlas connection error:", err));


// Basic route for testing
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});