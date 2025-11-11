// app/login/page.jsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/'); // or '/admin'
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border px-4 py-2 rounded"
      />
      <input
        type="password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border px-4 py-2 rounded"
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
    </form>
  );
}
