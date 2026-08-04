import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function AddClientForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    status: 'Active',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        contactName: initialData.contactName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
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
        await API.put(`/clients/${id}`, formData);
      } else {
        await API.post('/clients', formData);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to save client:', err);
      setError(err.response?.data?.message || 'Failed to save client. Please try again.');
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
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Company Name (Client) *</label>
        <input 
          required 
          type="text" 
          name="companyName" 
          value={formData.companyName} 
          onChange={handleChange} 
          placeholder="e.g. Bob's Plumbing"
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Primary Contact Name *</label>
          <input 
            required
            type="text" 
            name="contactName" 
            value={formData.contactName} 
            onChange={handleChange} 
            placeholder="e.g. Bob Smith"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Contact Email *</label>
          <input 
            required
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="bob@plumbing.com"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Phone</label>
          <input 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="(555) 000-0000"
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
            <option value="Churned">Churned</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Notes (Optional)</label>
        <textarea 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange} 
          placeholder="Any details about this client..."
          rows="3"
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
        />
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
          {loading ? 'Saving...' : initialData ? 'Update Client' : 'Save Client'}
        </button>
      </div>
    </form>
  );
}