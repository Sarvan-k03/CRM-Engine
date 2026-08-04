const Lead = require('../models/Lead.models');

// @desc    Create a new lead for a campaign
// @route   POST /api/leads
// @access  Private (All Roles)
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, city, serviceRequested, source, campaignId, status } = req.body;

    let lead = await Lead.create({
      name,
      email,
      phone,
      company, // Now company will be saved to MongoDB on creation!
      city,
      serviceRequested,
      source,
      campaignId: campaignId || null,
      status: status || 'New',
    });

    // Populate the newly created lead before sending it back
    lead = await lead.populate({
      path: 'campaignId',
      populate: {
        path: 'clientId',
        model: 'Client'
      }
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

    const leads = await Lead.find({ campaignId })
      .populate({
        path: 'campaignId',
        populate: {
          path: 'clientId',
          model: 'Client'
        }
      })
      .sort({ createdAt: -1 }); // Newest first

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
    }).populate({
      path: 'campaignId',
      populate: {
        path: 'clientId',
        model: 'Client'
      }
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.deleteOne();
    res.status(200).json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getAllLeads = async (req, res) => {
  try {
    // Deep populate campaign and the nested client
    const leads = await Lead.find()
      .populate({
        path: 'campaignId',
        populate: {
          path: 'clientId',
          model: 'Client' // Ensure this matches your Client model name exactly
        }
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createLead,
  getLeadsByCampaign,
  updateLead,
  deleteLead,
  getAllLeads
};