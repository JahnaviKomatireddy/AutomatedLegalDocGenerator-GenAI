import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      router.push('/chat');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 text-white">
      <h1 className="text-3xl font-bold text-center">Welcome back!</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 rounded-full bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-teal-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 rounded-full bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-teal-300"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="text-right text-sm">
        <a href="/forgot-password" className="text-teal-200 hover:underline">Forgot Password?</a>
      </div>

      <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold hover:scale-[1.02] transition-transform duration-300 shadow-lg"
        >
          Log In
        </button>

      <div className="text-center text-sm">
        Don’t have an account? <a href="/register" className="underline">Register</a>
      </div>

      <hr className="border-white/30" />

      <button className="w-full bg-white text-black py-2 rounded-full flex items-center justify-center gap-2 mt-2 hover:bg-gray-100 transition">
        <img src="/google.png" alt="Google" className="h-7 w-7" />
        Log in with Google
      </button>
    </form>
  );
}
