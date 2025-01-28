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
      return res.status(401).json({
        message: "Invalid email or password", // Mensaje claro para el frontend
        field: !user ? "email" : "password", // Campo que produjo el error
      });
    }

    // Check if the user has verified their email
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your account before logging in.", // Mensaje claro para el frontend
        field: "Please verify your account before logging in.", // Código de error interno (opcional)
      });
    }

    const token = generateToken(user);

    res.cookie("authToken", token, {
      domain: ".havenova.de",
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "Lax", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
