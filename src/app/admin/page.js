'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        fetchBlogs();
      } else {
        router.push('/login');
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setSession(session);
    });
  }, []);

  async function fetchBlogs() {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (!error) setBlogs(data);
  }

  async function handleCreate() {
    const { error } = await supabase.from('blogs').insert([{ title, content }]);
    if (!error) {
      setTitle('');
      setContent('');
      fetchBlogs();
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) fetchBlogs();
  }

  if (!session) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl mb-6">Admin Dashboard</h1>
      <div className="mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">
          Create Blog
        </button>
      </div>
      <h2 className="text-2xl mb-4">Existing Blogs</h2>
      {blogs.map((blog) => (
        <div key={blog.id} className="border p-4 mb-4 rounded">
          <h3>{blog.title}</h3>
          <button
            onClick={() => handleDelete(blog.id)}
            className="bg-red-600 text-white px-2 py-1 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
