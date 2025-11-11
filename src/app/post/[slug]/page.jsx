import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DeleteButton from '@/components/DeleteButton';

export const revalidate = 0;

async function getPost(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data;
}

export default async function PostDetailPage(props) {
  // Unwrap params if it's a Promise
  const params = typeof props.params?.then === 'function'
    ? await props.params
    : props.params;
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          ← Back to all posts
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {post.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <span className="font-medium">{post.author}</span>
            <span className="text-gray-400">•</span>
            <span>{formatDate(post.created_at)}</span>
            {post.published && (
              <>
                <span className="text-gray-400">•</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  Published
                </span>
              </>
            )}
          </div>

          {post.excerpt && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
              <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-gray-200">
            <Link
              href={`/edit/${post.id}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Edit Post
            </Link>
            <DeleteButton postId={post.id} imageUrl={post.featured_image} />
          </div>
        </div>
      </article>
    </div>
  );
}
