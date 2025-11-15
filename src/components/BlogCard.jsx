import Link from 'next/link';

export default function BlogCard({ post, isAdmin = false }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {post.featured_image && (
        <Link href={`/post/${post.slug}`}>
          <div className="h-48 w-full overflow-hidden bg-gray-200 cursor-pointer">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />                                                                                                                                                            
            </div>
        </Link>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span className="text-gray-600 font-medium">{post.author}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">{formatDate(post.created_at)}</span>
          {post.published && (
            <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
              Published
            </span>
          )}
        </div>

        <Link href={`/post/${post.slug}`}>
          <h2 className="text-2xl font-semibold tracking-wide text-gray-900 mb-3 hover:text-blue-600 transition cursor-pointer">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <Link
            href={`/post/${post.slug}`}
            className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Read More →
          </Link>
          {isAdmin && (
            <Link
              href={`/edit/${post.id}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
