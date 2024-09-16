const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { protect } = require("./middleware/authMiddleware");
const { swaggerDocs, swaggerUi } = require('./config/swagger');

dotenv.config(); // Load environment variables from .env file

connectDB(); // Connect to the MongoDB database

const app = express();

// Configure rate limiter for the login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message: "Too many login attempts, please try again later", // Message to show after limit is reached
  },
});



// Helmet secures the app by setting various HTTP headers for security

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "https://backend-api-1-1ns6.onrender.com"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:5173"],
      },
    },
  })
);


// Compression reduces the size of HTTP responses to optimize traffic
app.use(compression());

// Security against MongoDB injection: Sanitizes data to prevent NoSQL injection attacks
app.use(mongoSanitize());

// CORS configuration to allow requests only from the frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];
  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

// Enable CORS with the defined options
app.use(cors(corsOptions));

// Handel preflight requests
app.options('*', cors(corsOptions));

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Not allowed by CORS" });
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
  });
});

// Apply the rate limiter to the login route

app.use("/api/users/login", loginLimiter);

// Enable the use of JSON in incoming requests
app.use(express.json());

// Define the routes for users and services
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/services", protect, require("./routes/serviceRoutes"));
// app.use('/api/client', require('./routes/clientRoutes')) // (Commented in case it's needed in the future)

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Custom error handling middleware
app.use(errorHandler);

// Set the port and start the server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // Export the app for testing purposes
