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
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Excluir el campo password
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar el perfil del usuario" });
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

module.exports = { protect, admin, getUserProfile };
