const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
} = require('../controllers/campaign.controllers');

router.route('/')
  .post(createCampaign)
  .get(getCampaigns);

router.route('/:id')
  .put(updateCampaign)
  .delete(deleteCampaign);

module.exports = router;