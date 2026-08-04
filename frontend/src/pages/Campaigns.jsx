import React, { useState, useEffect } from 'react';
import { Plus, Search, Target, Trash2, Edit2, Loader, Building2 } from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';
import AddCampaignForm from '../components/AddCampaignForm';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await API.get('/campaigns');
      setCampaigns(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await API.delete(`/campaigns/${id}`);
        fetchCampaigns();
      } catch (error) {
        console.error('Failed to delete campaign:', error);
      }
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const filteredCampaigns = campaigns.filter((camp) => {
    const search = searchTerm.toLowerCase();
    return (
      camp.name?.toLowerCase().includes(search) ||
      camp.clientId?.companyName?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Marketing Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track ad spend and lead generation efforts across your client base.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Campaign
        </button>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 max-w-md relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="py-12 text-center">
            <Target className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 font-medium">No campaigns found.</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Campaign" to launch a campaign for a client.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pl-2">Campaign</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Budget</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCampaigns.map((camp) => (
                  <tr key={camp._id || camp.id} className="group transition-colors hover:bg-gray-50/60">
                    <td className="py-4 pl-2 font-semibold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                          <Target className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base">{camp.name}</p>
                          <span className="text-xs text-gray-400 font-normal">
                            Started: {camp.startDate ? new Date(camp.startDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                        {camp.clientId?.companyName || 'Unassigned'}
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-gray-900">
                      ${camp.budget ? camp.budget.toLocaleString() : '0'}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        camp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        camp.status === 'Paused' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(camp)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(camp._id || camp.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCampaign ? "Edit Campaign" : "Add New Campaign"}>
        <AddCampaignForm
          initialData={editingCampaign}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCampaigns();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}