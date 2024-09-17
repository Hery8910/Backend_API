const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,         
      role: user.role,      
      email: user.email     
    },
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }     
  );
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Compare passwords
    if (!(await user.matchPassword(password))) {
      const error = new Error("Invalid email or password"); // Incorrect password
      error.statusCode = 401;
      throw error;
    }

    // Check if the user has verified their email
    if (!user.isVerified) {
      const error = new Error("Please verify your account before logging in.");
      error.statusCode = 401;
      throw error;
    }

    // Send user details and JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
};

module.exports = loginUser;
