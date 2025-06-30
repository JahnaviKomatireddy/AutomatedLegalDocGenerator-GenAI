import { useRouter } from 'next/router';
export default function Home() {
   const router = useRouter();
return (
   <div  className="min-h-screen bg-cover bg-center relative text-white"
      style={{
        backgroundImage: "url('/home.png')",
      }}
    > 
     <div className="absolute inset-0 bg-black/50" />
{/* Login Button at Top Right */} 
   <button onClick={() => router.push('/login')}
     className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 px-4 py-1 rounded z-10 animate-fade-in-right"
    >
    <h2>Login</h2>
  </button>

  {/* Centered Welcome Message */}
  
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent animate-pulse">
  Welcome to AI Support Chatbot
</h1>
<div className="absolute bottom-6 w-full text-center z-10">
<p className="mt-4 text-lg text-white/80 animate-fade-in-up">
      Your 24/7 AI assistant for seamless tech support.
    </p>
  </div>
</div>
</div>
)}







