import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function AddCampaignForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Active',
    notes: ''
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch clients for dropdown selection
    const fetchClients = async () => {
      try {
        const res = await API.get('/clients');
        setClients(res.data.data || []);
      } catch (err) {
        console.error('Failed to load clients:', err);
      }
    };
    fetchClients();

    if (initialData) {
      setFormData({
        name: initialData.name || '',
        clientId: initialData.clientId?._id || initialData.clientId || '',
        budget: initialData.budget || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        status: initialData.status || 'Active',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialData) {
        const id = initialData._id || initialData.id;
        await API.put(`/campaigns/${id}`, formData);
      } else {
        await API.post('/campaigns', formData);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to save campaign:', err);
      setError(err.response?.data?.message || 'Failed to save campaign.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-2 font-sans">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Campaign Name *</label>
        <input 
          required 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="e.g. Summer Facebook Ads"
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Assign to Client *</label>
        <select 
          required
          name="clientId" 
          value={formData.clientId} 
          onChange={handleChange} 
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
        >
          <option value="">-- Select Client --</option>
          {clients.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.companyName} ({c.contactName})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Budget ($)</label>
          <input 
            type="number" 
            name="budget" 
            value={formData.budget} 
            onChange={handleChange} 
            placeholder="1000"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          >
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            value={formData.startDate} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">End Date (Optional)</label>
          <input 
            type="date" 
            name="endDate" 
            value={formData.endDate} 
            onChange={handleChange} 
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
        <button 
          type="button" 
          onClick={onCancel} 
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading} 
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? 'Saving...' : initialData ? 'Update Campaign' : 'Save Campaign'}
        </button>
      </div>
    </form>
  );
}