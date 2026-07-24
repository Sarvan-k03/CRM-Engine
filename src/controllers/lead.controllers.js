const Lead = require('../models/Lead.models');
const Campaign = require('../models/Campaign.models');

// @desc    Create a new lead for a campaign
// @route   POST /api/leads
// @access  Private (All Roles)
const createLead = async (req, res) => {
  try {
    const { name, email, phone, city, serviceRequested, source, campaignId } = req.body;

    // 1. Verify the campaign actually exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // 2. Create the lead
    const lead = await Lead.create({
      name,
      email,
      phone,
      city,
      serviceRequested,
      source,
      campaignId
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get leads (Filter by campaignId)
// @route   GET /api/leads/:campaignId
// @access  Private (All Roles)
const getLeadsByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const leads = await Lead.find({ campaignId }).sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a lead's status or details
// @route   PUT /api/leads/:id
// @access  Private (Admin, Manager)
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createLead,
  getLeadsByCampaign,
  updateLead
};