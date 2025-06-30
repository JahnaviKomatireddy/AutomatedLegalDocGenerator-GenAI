import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import ReactMarkdown from 'react-markdown';



const API = process.env.NEXT_PUBLIC_API_URL;

export default function ChatPage() {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // ✅ COMBINED useEffect: Fetch history + create one if empty
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      try {
        const res = await fetch(`${API}/api/chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load chats');
        const data = await res.json();
        setChatHistory(data);

        if (data.length === 0) {
          // ✅ Auto-create a new chat if none exists
          const newRes = await fetch(`${API}/api/chats`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const newChat = await newRes.json();
          setSelectedSessionId(newChat._id);
          setChatHistory([newChat]);
        } else {
          setSelectedSessionId(data[0]._id);
        }
      } catch (err) {
        console.error('❌ Failed to load or create chats:', err);
      }
    };

    init();
  }, []); // ✅ FIXED: Removed unnecessary re-triggers

  // ✅ Load messages for selected session
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedSessionId) return;
      try {
        const res = await fetch(`${API}/api/chats/${selectedSessionId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setMessages(data.messages || []);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
      }
    };

    fetchMessages();
  }, [selectedSessionId]);

  // ✅ Handle sending a message
 const handleSend = async () => {
  if (!input.trim() || !selectedSessionId) return;

  const rawText = input.trim();

  // Add GPT-style formatting prompt
const instructionPrompt = `
You are a helpful technical assistant. Respond clearly and concisely with structured formatting using Markdown. Follow these rules:
- Use **bold** titles or labels.
- For code examples, use proper fenced code blocks with language tag (e.g., \\\js).
- Use bullet points or numbered lists for clarity.
- Add spacing between sections.
- Avoid overly long paragraphs. Split into logical blocks.

Now answer the following user query:
`;

  const fullPrompt = instructionPrompt + '\n' + rawText;

  // Add user's raw question to UI immediately
  setMessages(prev => [...prev, { role: 'user', text: rawText }]);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch(`${API}/api/chats/${selectedSessionId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ text: fullPrompt }),
    });

    const { reply } = await res.json();
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error("Chat message failed:", err);
    setMessages(prev => [
      ...prev,
      { role: 'bot', text: '⚠️ GPT4All is not available right now.' },
    ]);
  } finally {
    setLoading(false);
  }
};


  // ✅ New chat handler
  const handleNewChat = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const res = await fetch(`${API}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const newChat = await res.json();
      setChatHistory(prev => [newChat, ...prev]);
      setSelectedSessionId(newChat._id);
      setMessages([]);
    } catch (err) {
      console.error('❌ New chat failed:', err);
    }
  };

  // ✅ Rename chat
  const handleRename = async (id, newTitle) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/chats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error('Rename failed');

      setChatHistory(prev =>
        prev.map(chat => (chat._id === id ? { ...chat, title: newTitle } : chat))
      );
    } catch (err) {
      console.error('❌ Rename failed:', err);
    }
  };

  // ✅ Delete chat
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/api/chats/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      setChatHistory(prev => prev.filter(chat => chat._id !== id));

      if (selectedSessionId === id) {
        setSelectedSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        selectedSessionId={selectedSessionId}
        onSelectSession={setSelectedSessionId}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <div className="flex-1 flex flex-col p-6 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">💬 AI Support Chat</h2>

     <div className="flex-1 overflow-y-auto px-4">
  {messages.map((msg, idx) => (
  <div
    key={idx}
    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`px-4 py-2 rounded-lg text-sm break-words max-w-xs sm:max-w-md ${
      msg.role === 'user'
        ? 'bg-blue-600 text-white self-end ml-auto text-base'
        : 'bg-gray-700 text-white self-start mr-auto text-sm'
    }`}
  >
    {msg.role === 'user' ? (
      msg.text
    ) : (
<div className="prose prose-invert">
      <ReactMarkdown>{msg.text}</ReactMarkdown>
    </div>
            
          )}
  </div>
  </div>
   ))}
     <div ref={bottomRef} />
</div>


        <div className="flex items-center mt-4">
          <input
            className="flex-1 p-3 rounded-l-md bg-gray-800 text-white outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask something..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-r-md disabled:opacity-50"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
