'use client';

import { useState } from 'react';
import ProductionAnalyze from '@/components/ProductionAnalyze';
import BatchAnalyze from '@/components/BatchAnalyze';

export default function ProductionPage() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  const tabs = [
    { id: 'single' as const, name: 'Single Analyze', icon: '🔍' },
    { id: 'batch' as const, name: 'Batch Analyze', icon: '📦' },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Production Endpoints</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sentiment analysis untuk cleaned content
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
        {activeTab === 'single' && <ProductionAnalyze />}
        {activeTab === 'batch' && <BatchAnalyze />}
      </div>
    </div>
  );
}

