'use client';

import ApifyCrawl from '@/components/ApifyCrawl';

export default function ApifyPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">APIFY</h1>
        <p className="mt-2 text-sm text-gray-600">
          Kelola crawling Facebook menggunakan Apify
        </p>
      </div>

      <ApifyCrawl />
    </div>
  );
}

