'use client';

import PostsList from '@/components/PostsList';

export default function PostsPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <p className="mt-2 text-sm text-gray-600">
          Daftar posts dari social media platforms
        </p>
      </div>

      <PostsList />
    </div>
  );
}
