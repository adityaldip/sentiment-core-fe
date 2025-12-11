'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, RootResponse, HealthCheckResponse } from '@/lib/api';

export default function Dashboard() {
  const [rootStatus, setRootStatus] = useState<RootResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview dan quick access ke semua endpoints
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error: {error}</p>
          <button
            onClick={loadStatus}
            className="mt-2 text-sm underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  rootStatus ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {rootStatus ? '✓' : '○'}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Service Status
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? 'Loading...' : rootStatus?.status || 'Unknown'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  healthStatus?.status === 'healthy' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {healthStatus?.status === 'healthy' ? '✓' : '○'}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Health Status
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? 'Loading...' : healthStatus?.status || 'Unknown'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  v
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Version
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? 'Loading...' : rootStatus?.version || 'Unknown'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/health"
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition"
            >
              <h3 className="font-medium text-gray-900">Health Check</h3>
              <p className="text-sm text-gray-500 mt-1">Cek status service dan dependencies</p>
            </Link>

            <Link
              href="/poc"
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition"
            >
              <h3 className="font-medium text-gray-900">POC Endpoints</h3>
              <p className="text-sm text-gray-500 mt-1">Analyze, Statistics, dan Posts List</p>
            </Link>

            <Link
              href="/production"
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition"
            >
              <h3 className="font-medium text-gray-900">Production Endpoints</h3>
              <p className="text-sm text-gray-500 mt-1">Single dan Batch Analysis</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Health Details */}
      {healthStatus && (
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Health Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {healthStatus.checks && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Database</p>
                    <p className={`text-lg font-medium ${
                      healthStatus.checks.database === 'healthy' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {healthStatus.checks.database || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Redis</p>
                    <p className={`text-lg font-medium ${
                      healthStatus.checks.redis === 'healthy' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {healthStatus.checks.redis || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className={`text-lg font-medium ${
                      healthStatus.checks.model === 'healthy' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {healthStatus.checks.model || 'N/A'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

