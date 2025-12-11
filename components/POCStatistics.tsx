'use client';

import { useState, useEffect } from 'react';
import { api, POCStatisticsResponse } from '@/lib/api';

export default function POCStatistics() {
  const [stats, setStats] = useState<POCStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    platform: '',
    date_from: '',
    date_to: '',
  });

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (filters.platform) params.platform = filters.platform;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      const data = await api.getPOCStatistics(params);
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics Filters</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                id="platform"
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
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
              <label htmlFor="date_from" className="block text-sm font-medium text-gray-700">
                Date From
              </label>
              <input
                type="datetime-local"
                id="date_from"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="date_to" className="block text-sm font-medium text-gray-700">
                Date To
              </label>
              <input
                type="datetime-local"
                id="date_to"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={loadStatistics}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Statistics'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {stats && (
        <>
          {/* Summary */}
          {stats.summary && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Posts</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">
                      {stats.summary.total_posts_analyzed?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Avg Processing Time</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">
                      {stats.summary.avg_processing_time?.toFixed(3) || '0.000'}s
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Avg Confidence</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">
                      {stats.summary.avg_confidence?.toFixed(3) || '0.000'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Date Range</p>
                    <p className="text-sm font-medium mt-1 text-gray-900">
                      {stats.summary.date_range?.from ? new Date(stats.summary.date_range.from).toLocaleDateString() : 'N/A'} - {stats.summary.date_range?.to ? new Date(stats.summary.date_range.to).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sentiment Distribution */}
          {stats.sentiment_distribution && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Sentiment Distribution</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-500">Positive</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                      {stats.sentiment_distribution.positive?.count || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.sentiment_distribution.positive?.percentage?.toFixed(1) || '0.0'}% (avg: {stats.sentiment_distribution.positive?.avg_score?.toFixed(3) || '0.000'})
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-500">Negative</p>
                    <p className="text-2xl font-bold mt-1 text-red-600">
                      {stats.sentiment_distribution.negative?.count || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.sentiment_distribution.negative?.percentage?.toFixed(1) || '0.0'}% (avg: {stats.sentiment_distribution.negative?.avg_score?.toFixed(3) || '0.000'})
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Neutral</p>
                    <p className="text-2xl font-bold mt-1 text-gray-600">
                      {stats.sentiment_distribution.neutral?.count || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.sentiment_distribution.neutral?.percentage?.toFixed(1) || '0.0'}% (avg: {stats.sentiment_distribution.neutral?.avg_score?.toFixed(3) || '0.000'})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Breakdown */}
          {stats.platform_breakdown && Object.keys(stats.platform_breakdown).length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Positive</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Negative</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Neutral</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(stats.platform_breakdown).map(([platform, data]) => (
                        <tr key={platform}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {platform}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {data?.count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            {data?.positive || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {data?.negative || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {data?.neutral || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          {stats.performance_metrics && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stats.performance_metrics.latency_percentiles && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Latency Percentiles</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">P50:</span>
                          <span className="font-medium">{stats.performance_metrics.latency_percentiles.p50?.toFixed(3) || '0.000'}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">P95:</span>
                          <span className="font-medium">{stats.performance_metrics.latency_percentiles.p95?.toFixed(3) || '0.000'}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">P99:</span>
                          <span className="font-medium">{stats.performance_metrics.latency_percentiles.p99?.toFixed(3) || '0.000'}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Max:</span>
                          <span className="font-medium">{stats.performance_metrics.latency_percentiles.max?.toFixed(3) || '0.000'}s</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {stats.performance_metrics.confidence_distribution && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Confidence Distribution</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">High:</span>
                          <span className="font-medium text-green-600">{stats.performance_metrics.confidence_distribution.high || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Medium:</span>
                          <span className="font-medium text-yellow-600">{stats.performance_metrics.confidence_distribution.medium || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Low:</span>
                          <span className="font-medium text-red-600">{stats.performance_metrics.confidence_distribution.low || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {stats.performance_metrics.text_length_stats && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Text Length Stats</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Avg:</span>
                          <span className="font-medium">{stats.performance_metrics.text_length_stats.avg?.toFixed(0) || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Min:</span>
                          <span className="font-medium">{stats.performance_metrics.text_length_stats.min || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Max:</span>
                          <span className="font-medium">{stats.performance_metrics.text_length_stats.max || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Raw Response</h2>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto text-gray-900">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

