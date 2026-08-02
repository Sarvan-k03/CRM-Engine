import React, { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import AddLeadForm from "../components/AddLeadForm";
import SkeletonLoader from "../components/SkeletonLoader";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const statusColors = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-purple-100 text-purple-700",
  Won: "bg-green-100 text-green-700",
};

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        // FIXED: Backend route is GET /api/leads/:campaignId
        // Using 'Direct' (or campaign ID) to match the campaign assigned when creating leads
        const response = await API.get("/leads/64f0c3a1f0d1c2a3b4c5d6e7");

        console.log("GET /leads Backend Response:", response.data);

        let fetchedLeads = [];
        if (Array.isArray(response.data)) {
          fetchedLeads = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          fetchedLeads = response.data.data;
        } else if (response.data && Array.isArray(response.data.leads)) {
          fetchedLeads = response.data.leads;
        }

        setLeads(fetchedLeads);
      } catch (error) {
        console.error("Failed to load leads", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

 const handleAddLead = (newLead) => {
    console.log('NEW LEAD RETURNED FROM BACKEND:', newLead);
    setLeads((prev) => [newLead, ...prev]);
    toast.success('Lead added successfully');
  };

  const handleEditLead = (updatedLead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead)),
    );
    toast.success("Lead updated successfully");
  };

  const handleDeleteLead = async (leadId) => {
    const confirmed = window.confirm("Delete this lead?");
    if (!confirmed) return;

    const previousLeads = leads;

    setLeads((prev) => prev.filter((lead) => lead._id !== leadId));

    try {
      await API.delete(`/leads/${leadId}`);
      toast.success("Lead deleted successfully");
    } catch (error) {
      console.error("Failed to delete lead", error);
      setLeads(previousLeads);
      toast.error("Failed to delete lead");
    }
  };

  const handleStatusChange = async (leadId, nextStatus) => {
    const previousLeads = leads;

    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId ? { ...lead, status: nextStatus } : lead,
      ),
    );

    try {
      await API.put(`/leads/${leadId}`, { status: nextStatus });
      toast.success("Status updated");
    } catch (error) {
      console.error("Failed to update lead status", error);
      setLeads(previousLeads);
      toast.error("Failed to update status");
    }
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const closeEditModal = () => {
    setEditingLead(null);
    setIsEditModalOpen(false);
  };

  const emptyState = useMemo(
    () => !isLoading && leads.length === 0,
    [isLoading, leads.length],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-600">
            Manage incoming opportunities and keep your pipeline moving.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <SkeletonLoader />
        ) : emptyState ? (
          <div className="flex h-48 flex-col items-center justify-center px-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No leads found.
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Add one to get started!
            </p>
          </div>
        ) : (
          <div className="w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Lead Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Created Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {leads.map((lead) => (
                  <tr key={lead._id || lead.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <Link
                        to={`/leads/${lead._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={lead.status}
                        onChange={(event) =>
                          handleStatusChange(lead._id, event.target.value)
                        }
                        className={`rounded-full border border-transparent px-2.5 py-1 text-xs font-medium focus:outline-none ${statusColors[lead.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Won">Won</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === lead._id ? null : lead._id,
                            )
                          }
                          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label="Lead actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {activeMenuId === lead._id ? (
                          <div className="absolute right-0 z-50 mt-2 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
                            <button
                              type="button"
                              onClick={() => openEditModal(lead)}
                              className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            {user?.role?.toLowerCase() === "admin" ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(lead._id)}
                                className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Lead"
      >
        <AddLeadForm
          onSuccess={handleAddLead}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Lead"
      >
        {editingLead ? (
          <AddLeadForm
            onSuccess={handleEditLead}
            onClose={closeEditModal}
            initialValues={editingLead}
            submitLabel="Save Changes"
            mode="edit"
          />
        ) : null}
      </Modal>
    </div>
  );
}
