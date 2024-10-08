const { check, validationResult } = require("express-validator");
const { create, find } = require('../../models/ServiceRequest');

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
  
  module.exports = { validateServiceRequest, getServiceRequests };