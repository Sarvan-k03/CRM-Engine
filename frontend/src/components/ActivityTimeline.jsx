import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';

const defaultItems = [
  { title: 'Created', description: 'Lead was created in the CRM', time: 'Today' },
  { title: 'Status Changed', description: 'Lead moved to Contacted', time: 'Yesterday' },
  { title: 'Note Added', description: 'Introduced the product and shared pricing', time: '2 days ago' },
];

export default function ActivityTimeline({ leadId }) {
  const [note, setNote] = useState('');
  const [items, setItems] = useState(defaultItems);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!note.trim()) return;

    setIsSubmitting(true);

    try {
      await API.post(`/leads/${leadId}/notes`, { note });
      setItems((prev) => [{ title: 'Note Added', description: note, time: 'Just now' }, ...prev]);
      setNote('');
      toast.success('Note added');
    } catch (error) {
      toast.error('Unable to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
        <p className="text-sm text-gray-500">Recent progress and notes for this lead.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Add a Note</label>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows="3"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Write down the latest update..."
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </form>

      <div className="relative pl-6">
        <div className="absolute left-2.5 top-0 h-full w-px bg-gray-200" />
        <div className="space-y-5">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="relative">
              <div className="absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600" />
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
