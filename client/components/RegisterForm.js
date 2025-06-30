// components/RegisterForm.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      alert('Registered! Please login.');
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
     <div className="bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-xl shadow-xl w-full max-w-sm">

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-blue-50 text-gray-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-blue-50 text-gray-800 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-semibold hover:scale-[1.02] transition-transform duration-200 shadow-md"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-700 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
