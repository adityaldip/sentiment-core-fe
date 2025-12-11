'use client';

import { useState } from 'react';
import { api, POCAnalyzeRequest, POCAnalyzeResponse } from '@/lib/api';

export default function POCAnalyze() {
  const [formData, setFormData] = useState<POCAnalyzeRequest>({
    text: '',
    platform: 'tiktok',
    source_id: undefined,
  });
  const [result, setResult] = useState<POCAnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await api.analyzePOC(formData);
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analyze Sentiment (POC)</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                Text *
              </label>
              <textarea
                id="text"
                rows={6}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Masukkan text untuk dianalisis..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimal 10 karakter setelah preprocessing
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                  Platform *
                </label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label htmlFor="source_id" className="block text-sm font-medium text-gray-700">
                  Source ID (Optional)
                </label>
                <input
                  type="number"
                  id="source_id"
                  value={formData.source_id || ''}
                  onChange={(e) => setFormData({ ...formData, source_id: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="12345"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !formData.text.trim()}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Result</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Sentiment</p>
                <p className={`text-2xl font-bold mt-1 ${
                  result.sentiment === 'positive' ? 'text-green-600' :
                  result.sentiment === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {result.sentiment}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {result.score.toFixed(3)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {result.confidence.toFixed(3)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <div>
                <p className="text-sm text-gray-500">Neutral Score</p>
                <p className="text-lg font-medium text-gray-600">
                  {result.neutral_score.toFixed(3)}
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
                  <p className="text-gray-500">Text Length</p>
                  <p className="font-medium text-gray-900">{result.text_length} chars</p>
                </div>
                <div>
                  <p className="text-gray-500">Platform</p>
                  <p className="font-medium text-gray-900">{result.platform}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mode</p>
                  <p className="font-medium text-gray-900">{result.mode}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Raw Response:</h3>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto text-gray-900">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

