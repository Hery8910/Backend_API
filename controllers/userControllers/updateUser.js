const User = require("../../models/User");

const updateUser = async (req, res, next) => {
    try {
      const { name, email,  address, phone } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
        console.log("User not found:", user);
        
      if (!user) {
        return res.status(401).json({
          message: "Something went wrong", 
        });
      }
      user.name = name;
      user.address = address;
      user.phone = phone;
      await user.save();
        // Send user details
        res.status(200).json({
          message: "User successfully updated",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            address: user.address,
            phone: user.phone,
          }
        });
      } catch (err) {
        next(err);
      }
    };
  
  module.exports = updateUser;