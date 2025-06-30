import Sidebar from '@/components/Sidebar'; // or '../components/Sidebar' depending on structure

export default function ChatSession() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Chat Window</h1>
        {/* Other content */}
      </div>
    </div>
  );
}
