import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('🚫 Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMsg('');

      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMsg(res.data.message || '✅ Password reset successful!');
    } catch (err) {
      setError(err.response?.data?.error || '❌ Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (msg) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        router.push('/login');
      }

      return () => clearInterval(timer);
    }
  }, [msg, countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-blue-200 to-indigo-300 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/30">
        <h2 className="text-2xl font-bold text-center text-indigo-800 mb-6">
          🔐 Reset Your Password
        </h2>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-blue-50 text-gray-800 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-blue-50 text-gray-800 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {msg && (
            <p className="text-green-700 text-sm text-center">
              {msg} <br />
              Redirecting to login in <strong>{countdown}</strong> sec...
            </p>
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={loading}
          >
            {loading ? '🔄 Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
