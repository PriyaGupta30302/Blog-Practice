// components/DeleteButton.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DeleteButton({ postId, imageUrl }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      // Delete image from storage if exists
      if (imageUrl && imageUrl.includes('blog-images')) {
        const fileName = imageUrl.split('/blog-images/')[1];
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('blog-images')
            .remove([fileName]);

          if (storageError) {
            console.error('Error deleting image:', storageError);
          }
        }
      }

      // Delete post from database
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      alert('Post deleted successfully!');
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
    >
      {loading ? 'Deleting...' : 'Delete Post'}
    </button>
  );
}
