const User = require("../../models/User");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // Token válido por 1 hora
    await user.save();

    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map(
      (origin) => origin.trim()
    );
    const frontendUrl =
      process.env.NODE_ENV === "production"
        ? allowedOrigins[1]
        : allowedOrigins[0];

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    const message = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = forgotPassword;
