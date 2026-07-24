const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ], 
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Lead phone number is required'],
      trim: true,
      index: true, 
    },
    city: {
      type: String,
      trim: true,
    },
    serviceRequested: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference ID is required'],
      index: true, 
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Rejected'],
      default: 'New', 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);