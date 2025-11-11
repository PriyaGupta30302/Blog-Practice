import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BlogForm from '@/components/BlogForm';

export const revalidate = 0;

async function getPost(id) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data;
}

export default async function EditPostPage(props) {
  // Unwrap params if it's a Promise (for compatibility)
  const params = typeof props.params?.then === 'function'
    ? await props.params
    : props.params;
    
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Edit Blog Post
        </h1>
        <p className="text-gray-600 mb-8">
          Update your blog post and click "Update Post" to save changes.
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <BlogForm post={post} />
        </div>
      </div>
    </div>
  );
}
