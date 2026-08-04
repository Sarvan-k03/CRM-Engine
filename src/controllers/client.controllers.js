const Client = require('../models/Client.models');

// @desc    Create a new client
// @route   POST /api/clients
const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    // Check for duplicate company name (Mongoose code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A client with this company name already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all clients
// @route   GET /api/clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a client (Edit details or change status)
// @route   PUT /api/clients/:id
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await client.deleteOne();
    res.status(200).json({ success: true, message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createClient,
  getClients,
  updateClient,
  deleteClient
};