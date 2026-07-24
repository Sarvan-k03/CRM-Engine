const Campaign = require('../models/Campaign.models');

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (Admin, Manager)
const createCampaign = async (req, res) => {
  try {
    const { title, clientId, budget, status, startDate, endDate } = req.body;

    const campaign = await Campaign.create({
      title,
      clientId,
      budget,
      status,
      startDate,
      endDate
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all campaigns (with optional filtering by clientId)
// @route   GET /api/campaigns
// @access  Private (All Roles)
const getCampaigns = async (req, res) => {
  try {
    // If the user is a Client, force the query to only show their own campaigns
    const filter = req.user.role === 'Client' ? { clientId: req.user._id } : {};

    const campaigns = await Campaign.find(filter).populate('clientId', 'name email');
    
    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Admin, Manager)
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Forces Mongoose to re-check rules (e.g., budget is a number)
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  updateCampaign
};