const express = require('express');
const router = express.Router();
const { createLead, getLeadsByCampaign, updateLead, deleteLead ,getAllLeads} = require('../controllers/lead.controllers');

// Import your security middleware
const { protect, authorize } = require('../middleware/auth.middleware');

// Apply 'protect' to ALL routes below this line
router.use(protect); 

// @route   POST /api/leads
// Anyone logged in can add a lead
router.post('/', createLead);

// @route   GET /api/leads/:campaignId
// Anyone logged in can view leads for a campaign
// @route   GET /api/leads
router.get('/', getAllLeads);
router.get('/:campaignId', getLeadsByCampaign);

// @route   PUT /api/leads/:id
// ONLY Admins and Managers can update a lead (e.g., change status to "Converted")
router.put('/:id', authorize('Admin', 'Manager'), updateLead);


router.delete('/:id', authorize('Admin', 'Manager'), deleteLead);

module.exports = router;
