'use client';

import { useState, useEffect } from 'react';
import { api, POCPostsResponse, POCPostsParams } from '@/lib/api';

export default function POCPosts() {
  const [posts, setPosts] = useState<POCPostsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<POCPostsParams>({
    platform: '',
    sentiment: undefined,
    limit: 50,
    offset: 0,
    order_by: 'created_at',
    order_dir: 'desc',
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPOCPosts(filters);
      setPosts(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [filters.offset]);

  const handleFilterChange = (key: keyof POCPostsParams, value: any) => {
    setFilters({ ...filters, [key]: value, offset: 0 });
  };

  const handlePageChange = (newOffset: number) => {
    setFilters({ ...filters, offset: newOffset });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Posts List Filters</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                id="platform"
                value={filters.platform || ''}
                onChange={(e) => handleFilterChange('platform', e.target.value || undefined)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Platforms</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label htmlFor="sentiment" className="block text-sm font-medium text-gray-700">
                Sentiment
              </label>
              <select
                id="sentiment"
                value={filters.sentiment || ''}
                onChange={(e) => handleFilterChange('sentiment', e.target.value || undefined)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
                Limit
              </label>
              <input
                type="number"
                id="limit"
                min="1"
                max="100"
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="order_by" className="block text-sm font-medium text-gray-700">
                Order By
              </label>
              <select
                id="order_by"
                value={filters.order_by}
                onChange={(e) => handleFilterChange('order_by', e.target.value as any)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="created_at">Created At</option>
                <option value="confidence">Confidence</option>
                <option value="processing_time">Processing Time</option>
              </select>
            </div>
            <div>
              <label htmlFor="order_dir" className="block text-sm font-medium text-gray-700">
                Order Direction
              </label>
              <select
                id="order_dir"
                value={filters.order_dir}
                onChange={(e) => handleFilterChange('order_dir', e.target.value as any)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={loadPosts}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Posts'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {posts && (
        <>
          {/* Posts Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Posts ({posts.total} total)
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {posts.offset + 1} - {Math.min(posts.offset + posts.limit, posts.total)} of {posts.total}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Text Preview</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {post.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {post.platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.sentiment_label === 'positive' ? 'bg-green-100 text-green-800' :
                            post.sentiment_label === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {post.sentiment_label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {post.sentiment_score.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {post.confidence.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {post.text_preview}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(0, posts.offset - posts.limit))}
                    disabled={posts.offset === 0}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(posts.offset + posts.limit)}
                    disabled={posts.offset + posts.limit >= posts.total}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{posts.offset + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(posts.offset + posts.limit, posts.total)}</span> of{' '}
                      <span className="font-medium">{posts.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(0, posts.offset - posts.limit))}
                        disabled={posts.offset === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(posts.offset + posts.limit)}
                        disabled={posts.offset + posts.limit >= posts.total}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raw JSON */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Raw Response</h2>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(posts, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

