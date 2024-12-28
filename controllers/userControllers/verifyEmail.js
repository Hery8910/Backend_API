const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");


const verifyEmail = async (req, res) => {
  try {
    // Decode the token from the verification URL
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "El correo ya ha sido verificado." });
    }

    user.isVerified = true;
    await user.save();

      // Generate a JWT token for authentication
      const authToken = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Send the authToken as a cookie
      res.cookie("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      });
  
      // Send user details
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "El correo ya ha sido verificado." });
    }

    const verificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify-email/${verificationToken}`;
    const html = `
    <h1>Welcome, ${user.name}!</h1>
    <p>Please verify your account by clicking the link below:</p>
    <a href="${verificationUrl}">Verify Account</a>
    <p>Thank you,</p>
    <p>Cleaning Service Team</p>`;

    await sendEmail({
      email,
      subject: "Resend Account Verification - Havenova",
      html,
    });

    res
      .status(200)
      .json({ message: "Correo de verificación reenviado con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al reenviar el correo de verificación" });
  }
};

module.exports = { verifyEmail, resendVerificationEmail };
