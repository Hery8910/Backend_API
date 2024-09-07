const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

// Middleware function to protect routes and ensure only authenticated users can access
const protect = async (req, res, next) => {
  let token;

  // Check if the request contains an Authorization header and if it starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID from the decoded token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      // Call the next middleware function or route handler
      next();
    } catch (error) {
      // If token verification fails, log the error and return a 401 Unauthorized response
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware function to allow only admin users to access certain routes
const admin = (req, res, next) => {
  // Check if the authenticated user has the role of 'admin'
  if (req.user && req.user.role === "admin") {
    next(); // Allow the request to proceed
  } else {
    // Return a 403 Forbidden response if the user is not an admin
    res.status(403).json({ message: "Access denied, you are not an administrator" });
  }
};

module.exports = { protect, admin }; // Export the middleware functions
