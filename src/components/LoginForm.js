// components/LoginForm.js
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    // On success, redirect or update UI
  }
  
  return (
    <form className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded" onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="mb-4 w-full px-4 py-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-4 w-full px-4 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Login
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
