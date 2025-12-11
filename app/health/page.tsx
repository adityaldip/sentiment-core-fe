'use client';

import { useEffect, useState } from 'react';
import { api, RootResponse, HealthCheckResponse } from '@/lib/api';

export default function HealthPage() {
  const [rootStatus, setRootStatus] = useState<RootResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const [root, health] = await Promise.all([
        api.getRoot(),
        api.getHealth(),
      ]);
      setRootStatus(root);
      setHealthStatus(health);
    } catch (err: any) {
      setError(err.message || 'Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Health Check</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor status service dan dependencies
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={loadStatus}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Root Endpoint */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Root Endpoint</h2>
            {rootStatus ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Service:</span>
                  <span className="text-sm font-medium text-gray-900">{rootStatus.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Version:</span>
                  <span className="text-sm font-medium text-gray-900">{rootStatus.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-sm font-medium ${
                    rootStatus.status === 'running' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {rootStatus.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Port:</span>
                  <span className="text-sm font-medium text-gray-900">{rootStatus.port}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </div>
        </div>

        {/* Health Check Endpoint */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Health Check Endpoint</h2>
            {healthStatus ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-sm font-medium ${
                    healthStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {healthStatus.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Service:</span>
                  <span className="text-sm font-medium text-gray-900">{healthStatus.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Version:</span>
                  <span className="text-sm font-medium text-gray-900">{healthStatus.version}</span>
                </div>
                {healthStatus.checks && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Checks:</h3>
                    <div className="space-y-2">
                      {Object.entries(healthStatus.checks).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-gray-500 capitalize">{key}:</span>
                          <span className={`text-sm font-medium ${
                            value === 'healthy' ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* Raw JSON */}
      {(rootStatus || healthStatus) && (
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Raw Response</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {rootStatus && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Root:</h3>
                  <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto text-gray-900">
                    {JSON.stringify(rootStatus, null, 2)}
                  </pre>
                </div>
              )}
              {healthStatus && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Health:</h3>
                  <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto text-gray-900">
                    {JSON.stringify(healthStatus, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

