const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");

// Generate JWT token for email verification
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Add validation rules to the routes
const validateRegister = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Please provide a valid email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long"),
];

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, address, phone } = req.body;
    // Verify if there is error on the validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }

    // Look if user exist
    const userExists = await User.findOne({ email });

    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    // Hash the password before creating the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a verification token
    const verificationToken = generateToken(email);

    // Generate the verification URL
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify-email/${verificationToken}`;

    const html = `
  <h1>Welcome, ${name}!</h1>
  <p>Please verify your account by clicking the link below:</p>
  <a href="${verificationUrl}">Verify Account</a>
  <p>Thank you,</p>
  <p>Cleaning Service Team</p>
`;
    // Send the verification email
    await sendEmail({
      email,
      subject: "Account Verification - Havenova",
      html,
    });

    const user = await User.findOne({ email });
    // Respond with success message

    res.status(200).json({
      message: "We send you a verification email. Please check your email.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, validateRegister };
