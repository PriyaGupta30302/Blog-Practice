'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ImageUpload from '@/components/ImageUpload';
import dynamic from 'next/dynamic';

// Import RichTextEditor dynamically, disable SSR to avoid hydration issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function BlogForm({ post = null }) {
  const router = useRouter();
  const isEditing = !!post;

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    author: post?.author || '',
    featured_image: post?.featured_image || '',
    published: post?.published || false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, featured_image: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', post.id)
          .select();

        if (error) throw error;

        alert('Post updated successfully!');
        router.push(`/post/${data[0].slug}`);
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([formData])
          .select();

        if (error) throw error;

        alert('Post created successfully!');
        router.push('/');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={generateSlug}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter post title"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-2">
          Slug * (URL-friendly)
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="post-url-slug"
        />
        <p className="text-xs text-gray-500 mt-1">Auto-generated from title, or enter custom</p>
      </div>

      {/* Author */}
      <div>
        <label htmlFor="author" className="block text-sm font-medium mb-2">
          Author *
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Author name"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Short description (optional)"
        />
      </div>

      {/* Content with Rich Text Editor */}
      <div>
        <label className="block text-sm font-medium mb-2">Content *</label>
        <RichTextEditor
          initialContent={formData.content}
          onContentChange={({ html }) => setFormData((prev) => ({ ...prev, content: html }))}
        />
      </div>

      {/* Image Upload Component */}
      <ImageUpload onImageUploaded={handleImageUpload} currentImage={formData.featured_image} />

      {/* Published Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          name="published"
          checked={formData.published}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="published" className="ml-2 text-sm font-medium">
          Publish immediately
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
