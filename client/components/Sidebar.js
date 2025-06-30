import { useState } from 'react';

export default function Sidebar({
  onNewChat,
  chatHistory,
  selectedSessionId,
  onSelectSession,
  onRename,
  onDelete,
}) {
  const [editId, setEditId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4">AI Support</h1>

      <button
        onClick={onNewChat}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mb-4"
      >
        + New Chat
      </button>

      <div className="flex-1 flex flex-col gap-2">
        {chatHistory.map((chat) => (
          <div
            key={chat._id}
            className={`relative group p-2 rounded-lg flex items-center justify-between ${
              chat._id === selectedSessionId
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {editId === chat._id ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button
                  className="text-green-400 hover:text-green-500"
                  onClick={() => {
                    onRename(chat._id, newTitle);
                    setEditId(null);
                  }}
                >
                  ✅
                </button>
                <button
                  className="text-red-400 hover:text-red-500"
                  onClick={() => setEditId(null)}
                >
                  ❌
                </button>
              </div>
            ) : (
              <>
                <span
                  onClick={() => {
                     onSelectSession(chat._id);
                  setDropdownOpen(null);
                }}
                  className="flex-1 cursor-pointer truncate"
                >
                  {chat.title}
                </span>

                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === chat._id ? null : chat._id)
                    }
                     aria-haspopup="menu"
                    aria-expanded={dropdownOpen === chat._id}
                    className="ml-2 text-white hover:text-gray-300"
                  >
                    ⋯
                  </button>

                  {dropdownOpen === chat._id && (
                    <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded shadow z-50 text-black text-sm">
                      <button
                        className="w-full text-left px-3 py-1 hover:bg-gray-200"
                        onClick={() => {
                          setEditId(chat._id);
                          setNewTitle(chat.title);
                          setDropdownOpen(null);
                        }}
                      >
                        ✏️ Rename
                      </button>
                      <button
                        className="w-full text-left px-3 py-1 hover:bg-gray-200"
                        onClick={() => {
                          onDelete(chat._id);
                          setDropdownOpen(null);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <footer className="mt-4 text-xs text-gray-400 text-center">
        © 2025 Jayanth
      </footer>
    </div>
  );
}
