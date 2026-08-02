import React from 'react';

export default function MetricCard({ title, value, icon, trend }) {
  const isPositive = trend >= 0;
  const trendLabel = `${isPositive ? '+' : ''}${trend}%`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trendLabel}
        </span>
        <span className="ml-2 text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  );
}
