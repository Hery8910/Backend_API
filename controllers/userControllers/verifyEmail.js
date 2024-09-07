const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const verifyEmail = async (req, res, next) => {
  try {
    // Decode the token from the verification URL
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 400;
      throw error;
    }

    if (user.isVerified) {
      const error = new Error('User is already verified');
      error.statusCode = 400;
      throw error;
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.status(201).json({ message: 'Account successfully verified' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      // Handle invalid or expired token errors properly
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    next(error); // For other errors, pass to global error handler
  
  }
};

module.exports = verifyEmail;
