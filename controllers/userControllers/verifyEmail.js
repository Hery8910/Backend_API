const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const verifyEmail = async (req, res, next) => {
  try {
    // Decode the token from the verification URL
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.redirect("/email/verified-already");
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    res.redirect("/email/verified-success");
  } catch (error) {
    res.redirect("/email/verify-error");
    next(error); // For other errors, pass to global error handler
  
  }
};

module.exports = verifyEmail;
