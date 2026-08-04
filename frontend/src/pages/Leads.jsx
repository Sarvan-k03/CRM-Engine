import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Trash2, Edit2,
  Mail, Phone, Building, Loader, Target
} from 'lucide-react';
import API from '../services/api';
import AddLeadForm from '../components/AddLeadForm';
import Modal from '../components/Modal';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await API.get('/leads');
      setLeads(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Delete Lead Function
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await API.delete(`/leads/${id}`);
        fetchLeads(); // Refresh the list after deleting
      } catch (error) {
        console.error('Failed to delete lead:', error);
      }
    }
  };

  // Instant Status Change from Table Dropdown
  const handleStatusChange = async (lead, newStatus) => {
    try {
      const id = lead._id || lead.id;
      // We pass the full lead payload back, ensuring company/companyName is included just in case
      const payload = {
        ...lead,
        companyName: lead.company || lead.companyName, 
        status: newStatus
      };
      
      await API.put(`/leads/${id}`, payload);
      fetchLeads(); // Refresh the UI instantly
    } catch (error) {
      console.error('Failed to update lead status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Open modal for editing
  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  // Open modal for adding new lead
  const handleOpenAddModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  // Filter leads based on search input & status selection
  const filteredLeads = leads.filter((lead) => {
    // Check both the nested client company name, and the fallback lead company name
    const companyText = lead.campaignId?.clientId?.companyName || lead.company || lead.companyName || '';
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Horizon-style status badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Contacted':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Qualified':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header & Main Action */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage, track, and organize your potential clients.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* Horizon Card Container */}
      <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
        
        {/* Search and Filters Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">No leads found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pl-2">Lead Name</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Client / Campaign</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id || lead.id} className="group transition-colors hover:bg-gray-50/60">
                    
                    {/* Name & Avatar */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
                          {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-400">Added recently</p>
                        </div>
                      </div>
                    </td>

                    {/* Email / Phone */}
                    <td className="py-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        {lead.email && (
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Client & Campaign */}
                    <td className="py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                          <Building className="h-3.5 w-3.5 text-gray-400" />
                          {lead.campaignId?.clientId?.companyName || 'Direct / Unassigned'}
                        </div>
                        {lead.campaignId?.name && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 ml-5">
                            <Target className="h-3 w-3 text-gray-400" />
                            via {lead.campaignId.name}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Instant Dropdown */}
                    <td className="py-4">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead, e.target.value)}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer transition-all hover:opacity-80 ${getStatusBadge(lead.status)}`}
                      >
                        <option value="New" className="bg-white text-gray-900">New</option>
                        <option value="Contacted" className="bg-white text-gray-900">Contacted</option>
                        <option value="Qualified" className="bg-white text-gray-900">Qualified</option>
                        <option value="Converted" className="bg-white text-gray-900">Converted</option>
                        <option value="Rejected" className="bg-white text-gray-900">Rejected</option>
                      </select>
                    </td>

                    {/* Actions - Edit & Delete Buttons */}
                    <td className="py-4 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(lead)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="Edit Lead"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead._id || lead.id)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete Lead"
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

      {/* Add / Edit Lead Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingLead ? "Edit Lead" : "Add New Lead"}
      >
        <AddLeadForm
          initialData={editingLead}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchLeads();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
}