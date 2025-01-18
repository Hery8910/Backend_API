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

    // Compare passwords
    if (!user || !(await user.matchPassword(password))) {
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

    const token = generateToken(user);

    res.cookie("authToken", token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 3600000, // 1 hour
    });
      // Send user details
      res.status(200).json({
        message: "Login success.",
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

module.exports = loginUser;
