import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Target, Percent, 
  TrendingUp, Clock, Loader, Activity 
} from 'lucide-react';
import API from '../services/api';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all agency data simultaneously
        const [leadsRes, clientsRes, campaignsRes] = await Promise.all([
          API.get('/leads'),
          API.get('/clients'),
          API.get('/campaigns')
        ]);
        
        setLeads(leadsRes.data.data || leadsRes.data || []);
        setClients(clientsRes.data.data || []);
        setCampaigns(campaignsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // --- AGENCY METRICS CALCULATIONS ---
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalLeads = leads.length;
  
  const convertedDeals = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeads === 0 ? 0 : ((convertedDeals / totalLeads) * 100).toFixed(1);

  const stats = [
    {
      label: 'Active Clients',
      value: activeClients.toString(),
      change: 'Paying businesses',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Active Campaigns',
      value: activeCampaigns.toString(),
      change: 'Live marketing efforts',
      icon: Target,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Leads',
      value: totalLeads.toString(),
      change: 'Across all clients',
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: `${convertedDeals} leads won`,
      icon: Percent,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
  ];

  // --- TOP PERFORMING CAMPAIGNS CALCULATIONS ---
  // Count how many leads belong to each campaign
  const campaignPerformance = campaigns.map(camp => {
    const generatedLeads = leads.filter(l => {
      const leadCampId = l.campaignId?._id || l.campaignId;
      const currentCampId = camp._id || camp.id;
      return leadCampId === currentCampId;
    });
    return {
      ...camp,
      leadCount: generatedLeads.length
    };
  }).sort((a, b) => b.leadCount - a.leadCount).slice(0, 3); // Grab the top 3

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Agency Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor client growth, campaign performance, and lead generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs font-medium text-gray-600 bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-sm">
            <Clock className="mr-2 h-3.5 w-3.5 text-emerald-500" />
            Live Sync
          </div>
        </div>
      </div>

      {/* Top Row: Horizon-Style Stats Widgets */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="relative overflow-hidden rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{stat.value}</h3>
                </div>
                <div className={`rounded-full p-3 ${stat.iconBg}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-gray-500">
                <TrendingUp className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Top Performing Campaigns */}
      <div className="mt-8 rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Top Performing Campaigns</h2>
            <p className="text-xs text-gray-400 mt-0.5">Highest lead generation by active campaigns</p>
          </div>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>

        {campaignPerformance.length === 0 ? (
          <p className="text-sm text-gray-500">No campaigns running yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {campaignPerformance.map(camp => (
              <div key={camp._id || camp.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition-all hover:bg-gray-100/60">
                <div className="flex justify-between items-start mb-3">
                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                    <Target className="h-4 w-4" />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
                    {camp.leadCount} Leads
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{camp.name}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 truncate">
                  <Building2 className="h-3 w-3" />
                  {camp.clientId?.companyName || 'Unknown Client'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Row: Recent Activity Table Card */}
      <div className="mt-8 rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Live Lead Feed</h2>
        <p className="text-xs text-gray-400 mt-0.5">The newest prospects across all client campaigns</p>

        <div className="mt-6 flex flex-col gap-3">
          {leads.slice(0, 5).map((lead, index) => {
            // Find the campaign this lead belongs to so we can display it
            const leadCampId = lead.campaignId?._id || lead.campaignId;
            const parentCampaign = campaigns.find(c => (c._id || c.id) === leadCampId);
            const campaignName = parentCampaign ? parentCampaign.name : 'Direct / Organic';
            const clientName = parentCampaign?.clientId?.companyName ? `for ${parentCampaign.clientId.companyName}` : '';

            return (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/60 transition-all hover:bg-gray-100/60">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
                    <span className="inline-flex items-center rounded-full bg-gray-200/50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mt-1 truncate">
                    via <span className="text-gray-700">{campaignName}</span> {clientName}
                  </p>
                </div>
              </div>
            );
          })}
          {leads.length === 0 && (
            <p className="text-sm text-gray-500 py-4 text-center">No leads generated yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}