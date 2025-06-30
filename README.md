# AI Support Chatbot

An intelligent chatbot platform powered by **GPT4All** and **MongoDB**, built with **Next.js** (frontend) and **Express.js** (backend).

---

## 📁 Project Structure

ai-support-chatbot/
├── client/        → Frontend (Next.js + Tailwind CSS)
├── server/        → Backend (Node.js + Express + MongoDB)

---

## 🚀 Getting Started

### Backend Setup (Express.js + MongoDB)

```bash
cd server
npm install
npm run dev
 
 ----
Runs on http://localhost:5000

Requires a .env file in /server:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


# Frontend Setup (Next.js + Tailwind CSS)

cd client
npm install
npm run dev

Runs on http://localhost:3000

Requires a .env.local file in /client:
NEXT_PUBLIC_API_URL=http://localhost:5000


# Features
-- User Authentication (JWT)

-- Multi-session Chat UI

-- GPT4All AI Response (or fallback to OpenAI if needed)

-- Chat History (Stored in MongoDB)

-- Rename/Delete Sessions with dropdown menu

-- Modern UI with Tailwind CSS

-- File upload and voice input (optional extensions)

# Tech Stack
Layer	            Tech
Frontend	Next.js, React, Tailwind
Backend	    Node.js, Express.js
Database	MongoDB, Mongoose
AI Model	GPT4All / OpenAI (optional)

#  Note
--Ensure MongoDB is running locally or use MongoDB Atlas.

--GPT4All requires local model setup (see server/gpt4all.js or integration point).

--If you're using Railway, update your .env files accordingly for deployment.




