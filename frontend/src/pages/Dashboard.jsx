import MetricCard from '../components/MetricCard';

const metrics = [
  { title: 'Total Leads', value: '1,248', icon: '📈', trend: 12 },
  { title: 'Active Deals', value: '84', icon: '🤝', trend: -3 },
  { title: 'Conversion Rate', value: '8.4%', icon: '🎯', trend: 5 },
  { title: 'Revenue', value: '$42.5k', icon: '💰', trend: 18 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">A quick snapshot of your sales pipeline and performance.</p>
        </div>
        <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-500 shadow-sm">
          Updated 2 minutes ago
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
          <p className="mt-2 text-sm text-gray-500">This section will show charts and trends soon.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="rounded-lg bg-gray-50 px-3 py-2">New lead assigned to sales team</li>
            <li className="rounded-lg bg-gray-50 px-3 py-2">Deal moved to negotiation stage</li>
            <li className="rounded-lg bg-gray-50 px-3 py-2">Follow-up reminder sent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}