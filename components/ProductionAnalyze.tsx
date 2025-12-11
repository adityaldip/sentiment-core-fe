'use client';

import { useState } from 'react';
import { api, ProductionAnalyzeRequest, ProductionAnalyzeResponse } from '@/lib/api';

export default function ProductionAnalyze() {
  const [formData, setFormData] = useState<ProductionAnalyzeRequest>({
    content_id: 0,
    content: '',
  });
  const [result, setResult] = useState<ProductionAnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await api.analyzeProduction(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to analyze');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analyze Sentiment (Production)</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content_id" className="block text-sm font-medium text-gray-700">
                Content ID *
              </label>
              <input
                type="number"
                id="content_id"
                value={formData.content_id || ''}
                onChange={(e) => setFormData({ ...formData, content_id: parseInt(e.target.value) || 0 })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="12345"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content *
              </label>
              <textarea
                id="content"
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Masukkan content untuk dianalisis..."
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.content.trim() || formData.content_id <= 0}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Result</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Content ID</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {result.content_id}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Sentiment</p>
                <p className={`text-2xl font-bold mt-1 ${
                  result.sentiment_label === 'positive' ? 'text-green-600' :
                  result.sentiment_label === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {result.sentiment_label}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {result.sentiment_score.toFixed(3)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-lg font-medium text-gray-900">
                  {result.confidence.toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Positive Score</p>
                <p className="text-lg font-medium text-green-600">
                  {result.positive_score.toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Negative Score</p>
                <p className="text-lg font-medium text-red-600">
                  {result.negative_score.toFixed(3)}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Processing Time</p>
                  <p className="font-medium text-gray-900">{result.processing_time.toFixed(3)}s</p>
                </div>
                <div>
                  <p className="text-gray-500">Model Version</p>
                  <p className="font-medium text-gray-900">{result.model_version}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Raw Response:</h3>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

