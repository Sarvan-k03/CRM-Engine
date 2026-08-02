import React, { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';

const COLORS = ['#2563eb', '#f59e0b', '#8b5cf6', '#10b981'];

export default function Analytics() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const response = await API.get('/leads/64f0c3a1f0d1c2a3b4c5d6e7');
        setLeads(response.data.data || []);
      } catch (error) {
        console.error('Failed to load analytics', error);
        toast.error('Unable to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  const lineData = useMemo(() => {
    const counts = {};
    leads.forEach((lead) => {
      const date = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts)
      .slice(-10)
      .map(([name, value]) => ({ name, value }));
  }, [leads]);

  const pieData = useMemo(() => {
    const counts = { New: 0, Contacted: 0, Qualified: 0, Won: 0 };
    leads.forEach((lead) => {
      if (counts[lead.status] !== undefined) counts[lead.status] += 1;
    });

    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [leads]);

  const handleExport = () => {
    const header = ['Name', 'Email', 'Phone', 'Status', 'Created At'];
    const rows = leads.map((lead) => [lead.name, lead.email, lead.phone || '', lead.status, lead.createdAt || '']);
    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">Track lead performance and export your dataset.</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Loading analytics...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Leads Acquired over the last 30 days</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Leads by Status</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} fill="#8884d8">
                    {pieData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
