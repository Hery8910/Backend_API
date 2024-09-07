const mongoose = require("mongoose");

/**
 * Function to establish a connection to MongoDB.
 * It uses the connection string from the environment variables (MONGODB_URI).
 * If the connection is successful, it logs the MongoDB host.
 * If it fails, the error is caught, logged, and the process exits with a failure code.
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from the environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI, {});

    // Log a success message, displaying the host to which MongoDB is connected
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Catch any error that occurs during the connection attempt
    console.error(`Error: ${error.message}`);

    // Exit the process with a failure code (1) if the connection fails
    process.exit(1);
  }
};

// Export the function so that it can be used in other parts of the application
module.exports = connectDB;
