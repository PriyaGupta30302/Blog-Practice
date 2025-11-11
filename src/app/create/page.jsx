// app/create/page.js
import BlogForm from '@/components/BlogForm';

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Create New Blog Post
        </h1>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <BlogForm />
        </div>
      </div>
    </div>
  );
}
