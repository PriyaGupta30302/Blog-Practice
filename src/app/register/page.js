'use client';

// imports
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [userid, setUserid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    // Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, lastname, userid }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Insert user profile into your custom users table (set role to "user" by default)
    const { error: userError } = await supabase.from('users').insert([
      { name, lastname, userid, email, role: 'user' }
    ]);
    if (userError) {
      setErrorMsg(userError.message);
      return;
    }

    // Optionally: auto redirect to login or dashboard
    router.push('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded">
      <h2 className="text-2xl mb-4">Register</h2>
      <input type="text" placeholder="User ID" value={userid} onChange={e => setUserid(e.target.value)} className="border p-2 w-full mb-4" />
      <input type="text" placeholder="First Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-4" />
      <input type="text" placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)} className="border p-2 w-full mb-4" />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-4" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full mb-4" />
      <button onClick={handleRegister} className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
    </div>
  );
}
