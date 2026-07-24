const express = require('express');
const router = express.Router();
const { createCampaign, getCampaigns, updateCampaign } = require('../controllers/campaign.controllers');

// Import your security middleware
const { protect, authorize } = require('../middleware/auth.middleware');

// Apply 'protect' to ALL routes below this line
router.use(protect); 

// Routes
router.route('/')
  .get(getCampaigns) // Anyone logged in can view campaigns (Filtered in controller)
  .post(authorize('Admin', 'Manager'), createCampaign); // Only Admins/Managers can create

router.route('/:id')
  .put(authorize('Admin', 'Manager'), updateCampaign); // Only Admins/Managers can update

module.exports = router;