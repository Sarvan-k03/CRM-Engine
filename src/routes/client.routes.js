const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  updateClient,
  deleteClient
} = require('../controllers/client.controllers');

// Routes for /api/clients
router.route('/')
  .post(createClient)
  .get(getClients);

// Routes for /api/clients/:id
router.route('/:id')
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;