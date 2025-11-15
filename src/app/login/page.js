'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded">
      <h2 className="text-2xl mb-4">Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Login
      </button>
      
<p className="mt-4 text-center">
  Don't have an account?{' '}
  <a href="/register" className="text-blue-600 hover:underline">Register</a>
</p>

      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
    </div>
  );
}
