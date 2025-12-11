'use client';

import { useState } from 'react';
import { api, BatchAnalyzeRequest, BatchAnalyzeResponse, BatchItem } from '@/lib/api';

export default function BatchAnalyze() {
  const [items, setItems] = useState<BatchItem[]>([
    { content_id: 0, content: '' },
  ]);
  const [result, setResult] = useState<BatchAnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    if (items.length >= 32) {
      alert('Maximum 32 items per batch');
      return;
    }
    setItems([...items, { content_id: 0, content: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BatchItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('At least one item is required');
      return;
    }
    if (items.length > 32) {
      setError('Maximum 32 items per batch');
      return;
    }
    const validItems = items.filter(item => item.content_id > 0 && item.content.trim().length > 0);
    if (validItems.length === 0) {
      setError('At least one valid item is required');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await api.analyzeBatch({ items: validItems });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to analyze batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Batch Analyze (Max 32 items)</h2>
            <button
              type="button"
              onClick={addItem}
              disabled={items.length >= 32}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Item
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Item {index + 1}</h3>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-700">
                        Content ID *
                      </label>
                      <input
                        type="number"
                        value={item.content_id || ''}
                        onChange={(e) => updateItem(index, 'content_id', parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="12345"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-gray-700">
                        Content *
                      </label>
                      <textarea
                        rows={2}
                        value={item.content}
                        onChange={(e) => updateItem(index, 'content', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Masukkan content..."
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-3">
                {items.length} item(s) - Maximum 32 items per batch
              </p>
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : `Analyze ${items.filter(i => i.content_id > 0 && i.content.trim()).length} Item(s)`}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">Results</h2>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {result.total_items}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Processing Time</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {result.processing_time.toFixed(3)}s
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Results</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {result.results.length}
                </p>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processing Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.results.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.content_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.sentiment_label === 'positive' ? 'bg-green-100 text-green-800' :
                          item.sentiment_label === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.sentiment_label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.sentiment_score.toFixed(3)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.confidence.toFixed(3)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.processing_time ? `${item.processing_time.toFixed(3)}s` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

