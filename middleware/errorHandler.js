
const errorHandler = (err, req, res, next) => {
  // Set the status code from the error, or default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Respond with a JSON object containing the error message and stack trace
  res.status(statusCode).json({
    message: err.message, // Error message from the thrown error
    // If the app is running in production mode, hide the stack trace for security reasons
    // In development mode, show the stack trace to help with debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler; // Export the error handler middleware
