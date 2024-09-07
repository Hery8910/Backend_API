const User = require('../../models/User');

const getUserProfile = async (req, res) => {
  // Authentication has already been verified in the middleware `protect`
 try {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  } 
  // Return the user's details, excluding the password
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    });
  } catch (err) {
    next(err)
  }
};

module.exports = getUserProfile;
