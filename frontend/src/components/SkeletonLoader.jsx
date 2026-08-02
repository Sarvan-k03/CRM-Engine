import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="animate-pulse border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>

      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4">
            <div className="h-3 rounded bg-gray-200" />
            <div className="h-3 rounded bg-gray-200" />
            <div className="h-3 rounded bg-gray-200" />
            <div className="h-3 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
