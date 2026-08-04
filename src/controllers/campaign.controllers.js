const Campaign = require('../models/Campaign.models');

// @desc    Create a new campaign
// @route   POST /api/campaigns
const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    // Populate client details when returning
    await campaign.populate('clientId', 'companyName contactName');
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all campaigns (optionally filter by clientId)
// @route   GET /api/campaigns
const getCampaigns = async (req, res) => {
  try {
    const filter = {};
    if (req.query.clientId) {
      filter.clientId = req.query.clientId;
    }

    const campaigns = await Campaign.find(filter)
      .populate('clientId', 'companyName contactName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('clientId', 'companyName contactName');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    await campaign.deleteOne();
    res.status(200).json({ success: true, message: 'Campaign removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
};