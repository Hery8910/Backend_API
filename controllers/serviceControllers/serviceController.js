const { check, validationResult } = require("express-validator");
const { create, find } = require('../../models/ServiceRequest');
const ServiceRequest = require('../../models/ServiceRequest');

const validateServiceRequest = [
  // Validate that 'serviceType' is not empty
  check('serviceType').notEmpty().withMessage('Service type is required'),

  // Validate that 'date' is a valid date
  check('date').isISO8601().withMessage('Please provide a valid date'),

  // Validate that 'time' is not empty
  check('time').notEmpty().withMessage('Time is required'),

  // Validate that 'address' has a minimum length
  check('address').isLength({ min: 10 }).withMessage('Address must be at least 10 characters long'),
];

// Create a new service request
const createServiceRequest = async (req, res, next) => {
  try {
    const { serviceType, date, time, address, notes } = req.body;


    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    
    const serviceRequest = await ServiceRequest.create({
      user: req.user._id,
      serviceType,
      date,
      time,
      address,
      notes,
    });

    res.status(201).json(serviceRequest);
  } catch (err) {
    console.error('Error while creating service request:', err);
    res.status(500).json({ message: 'Error creating service request' });
    next(err);
  }
};


// Get all service requests (admins only)
const getServiceRequests = async (req, res, next) => {
  try {
    // Check if the user has admin permissions
    if (req.user.role !== 'admin') {
      const error = new Error('Not authorized to access this resource');
      error.statusCode = 403;
      throw error; // Throw the authorization error
    }

    // Get all service requests
    const serviceRequests = await find().populate('user', 'name email');

    // Return the list of requests
    res.json(serviceRequests);
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
};

module.exports = { validateServiceRequest, createServiceRequest, getServiceRequests };
