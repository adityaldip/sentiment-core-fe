'use client';

import { useState, useEffect } from 'react';
import { api, PostsResponse, PostsParams } from '@/lib/api';

export default function PostsList() {
  const [posts, setPosts] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostsParams>({
    platform: '',
    source: '',
    limit: 50,
    offset: 0,
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: PostsParams = {};
      if (filters.platform) params.platform = filters.platform;
      if (filters.source) params.source = filters.source;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;
      const data = await api.getPosts(params);
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [filters.offset]);

  const handleFilterChange = (key: keyof PostsParams, value: any) => {
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Posts Filters</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                id="source"
                value={filters.source || ''}
                onChange={(e) => handleFilterChange('source', e.target.value || undefined)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Sources</option>
                <option value="apify">Apify</option>
                <option value="post">Post</option>
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
                  Posts ({posts.pagination.total} total)
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {posts.pagination.offset + 1} - {Math.min(posts.pagination.offset + posts.pagination.count, posts.pagination.total)} of {posts.pagination.total}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crawled At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.data.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {post.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {post.platform}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {post.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.post_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {post.content || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.posted_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.crawled_at).toLocaleString()}
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
                    onClick={() => handlePageChange(Math.max(0, posts.pagination.offset - (posts.pagination.limit || 50)))}
                    disabled={!posts.pagination.has_prev}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(posts.pagination.offset + (posts.pagination.limit || 50))}
                    disabled={!posts.pagination.has_next}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{posts.pagination.offset + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(posts.pagination.offset + posts.pagination.count, posts.pagination.total)}</span> of{' '}
                      <span className="font-medium">{posts.pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      {/* First Page */}
                      <button
                        onClick={() => handlePageChange(0)}
                        disabled={!posts.pagination.has_prev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="First page"
                      >
                        ««
                      </button>
                      {/* Previous */}
                      <button
                        onClick={() => handlePageChange(Math.max(0, posts.pagination.offset - (posts.pagination.limit || 50)))}
                        disabled={!posts.pagination.has_prev}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {/* Page Numbers */}
                      {(() => {
                        const currentPage = Math.floor(posts.pagination.offset / (posts.pagination.limit || 50)) + 1;
                        const totalPages = posts.pagination.total_pages || Math.ceil(posts.pagination.total / (posts.pagination.limit || 50));
                        const pages: (number | string)[] = [];
                        
                        if (totalPages <= 7) {
                          // Show all pages if 7 or less
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                          }
                        } else {
                          // Show first, last, current, and neighbors
                          if (currentPage <= 3) {
                            for (let i = 1; i <= 4; i++) pages.push(i);
                            pages.push('...');
                            pages.push(totalPages);
                          } else if (currentPage >= totalPages - 2) {
                            pages.push(1);
                            pages.push('...');
                            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                          } else {
                            pages.push(1);
                            pages.push('...');
                            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                            pages.push('...');
                            pages.push(totalPages);
                          }
                        }
                        
                        return pages.map((page, idx) => {
                          if (page === '...') {
                            return (
                              <span key={`ellipsis-${idx}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            );
                          }
                          const pageNum = page as number;
                          const pageOffset = (pageNum - 1) * (posts.pagination.limit || 50);
                          const isCurrentPage = pageNum === currentPage;
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageOffset)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                isCurrentPage
                                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        });
                      })()}
                      {/* Next */}
                      <button
                        onClick={() => handlePageChange(posts.pagination.offset + (posts.pagination.limit || 50))}
                        disabled={!posts.pagination.has_next}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                      {/* Last Page */}
                      <button
                        onClick={() => {
                          const lastPageOffset = ((posts.pagination.total_pages || Math.ceil(posts.pagination.total / (posts.pagination.limit || 50))) - 1) * (posts.pagination.limit || 50);
                          handlePageChange(lastPageOffset);
                        }}
                        disabled={!posts.pagination.has_next}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Last page"
                      >
                        »»
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
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto text-gray-900 max-h-96">
                {JSON.stringify(posts, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
