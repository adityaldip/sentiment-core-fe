'use client';

import { useState } from 'react';
import POCAnalyze from '@/components/POCAnalyze';
import POCStatistics from '@/components/POCStatistics';
import POCPosts from '@/components/POCPosts';

export default function POCPage() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'statistics' | 'posts'>('analyze');

  const tabs = [
    { id: 'analyze' as const, name: 'Analyze', icon: '🔍' },
    { id: 'statistics' as const, name: 'Statistics', icon: '📊' },
    { id: 'posts' as const, name: 'Posts List', icon: '📝' },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">POC Endpoints</h1>
        <p className="mt-2 text-sm text-gray-600">
          Real-time sentiment analysis untuk raw Apify data
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'analyze' && <POCAnalyze />}
        {activeTab === 'statistics' && <POCStatistics />}
        {activeTab === 'posts' && <POCPosts />}
      </div>
    </div>
  );
}

