const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware function to protect routes and ensure only authenticated users can access

const protect = (req, res, next) => {
  const token = req.cookies.authToken; // Recuperar el token desde las cookies

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar los datos del usuario al request
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};


// Middleware function to allow only admin users to access certain routes
const admin = (req, res, next) => {
  // Check if the authenticated user has the role of 'admin'
  if (req.user && req.user.role === "admin") {
    next(); // Allow the request to proceed
  } else {
    // Return a 403 Forbidden response if the user is not an admin
    res
      .status(403)
      .json({ message: "Access denied, you are not an administrator" });
  }
};

module.exports = { protect, admin };
