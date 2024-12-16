const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // Limit of 5 try per IP
  message: "Too many login attempts. Please try again after 15 minutes.",
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many registration attempts. Please try again later.",
});

module.exports = { loginLimiter, registerLimiter };
