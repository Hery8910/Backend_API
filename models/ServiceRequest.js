// /models/ServiceRequest.js
const { Schema, model } = require('mongoose');

const serviceRequestSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  serviceType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String }
}, {
  timestamps: true
});

const ServiceRequest = model('ServiceRequest', serviceRequestSchema);
module.exports = ServiceRequest;
