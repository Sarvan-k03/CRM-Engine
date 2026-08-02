import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ActivityTimeline from '../components/ActivityTimeline';
import API from '../services/api';

export default function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLead = async () => {
      try {
        const response = await API.get(`/leads/64f0c3a1f0d1c2a3b4c5d6e7`);
        const foundLead = (response.data.data || []).find((item) => item._id === id);
        setLead(foundLead || null);
      } catch (error) {
        console.error('Failed to load lead', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLead();
  }, [id]);

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading lead details...</div>;
  }

  if (!lead) {
    return (
      <div className="p-6">
        <Link to="/leads" className="text-sm font-medium text-blue-600 hover:underline">
          ← Back to leads
        </Link>
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Lead not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Link to="/leads" className="mb-4 inline-flex text-sm font-medium text-blue-600 hover:underline">
        ← Back to leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Lead Profile</p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">{lead.name}</h1>
            <p className="mt-2 text-sm text-gray-500">{lead.email}</p>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-500">Phone</p>
              <p className="mt-1">{lead.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Status</p>
              <p className="mt-1">{lead.status}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Created</p>
              <p className="mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <ActivityTimeline leadId={id} />
      </div>
    </div>
  );
}
