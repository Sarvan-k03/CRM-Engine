const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client ID reference is required'],
      index: true, // Enables fast filtering by client
    },
    budget: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Completed'],
      default: 'Active',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Campaign', campaignSchema);