## Cleaning Service -  

This project is a RESTful API built for a Cleaning Service application. The API provides user registration, login, email verification, service request creation, and profile management. It includes comprehensive security measures such as authentication, authorization, data sanitization, and rate limiting to ensure safe interactions between the client and server.

## Installation

1. Clone the repository:

- git clone 'REPOSITORY'

2. Navigate to the project directory:

- cd 'REPOSITORY'

3. Install the necessary dependencies:

- npm install

4. Create a `.env` file at the root of the project with the following variables:

- touch .env

MONGODB_URI=Your URI
NEXTAUTH_SECRET=Your secret
JWT_SECRET=Your JWT Key
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM="Your-company-name no-reply@example.com"
FRONTEND_URL="http://localhost:3000"
ALLOWED_ORIGINS=http://localhost:3000,http://myapp.com

5. Start the server:

- npm start

## Usage

To run the application in development mode, use:
-npm run dev

For production:
npm start

## Project Structure

├── config/
│ └── db.js # Database connection
├── controllers/
│ ├── userController.js # User-related functions (registration, login, email verification)
│ └── serviceController.js # Service request handling
├── middleware/
│ ├── authMiddleware.js # Authentication and authorization checks
│ └── errorHandler.js # Global error handling middleware
├── models/
│ ├── User.js # User schema and methods
│ └── ServiceRequest.js # Service request schema
├── routes/
│ ├── userRoutes.js # User routes
│ └── serviceRoutes.js # Service request routes
├── tests/
│ └── user.test.js # Unit tests for user functionalities
├── .env.example # Example environment configuration
├── server.js # Main entry point for the application
└── README.md # Project documentation

## API Endpoints

### User Routes

- POST `/api/users/register`: Register a new user.
- POST `/api/users/login`: Login a user.
- GET `/api/users/verify-email/:token`: Verify a user's email.
- GET `/api/users/profile`: Get user profile (Protected).

### Service Routes

- POST `/api/services`: Create a new service request (Protected).
- GET `/api/services`: Get all service requests (Admin only).

## Authentication and Authorization

The API uses JWT (JSON Web Tokens) for authentication and role-based access control.

- Users must register and log in to receive a token.
- Protected routes require a valid token in the Authorization header.
- Admin-only routes are protected with additional checks for user roles.

## Testing and Security

To run the unit tests:

- npm test

Security measures implemented:

- **Rate Limiting**: Limits repeated login attempts.
- **CORS Protection**: Restricts requests from unauthorized origins.
- **MongoDB Data Sanitization**: Prevents NoSQL injection attacks.
- **Password Hashing**: Ensures user passwords are encrypted using bcrypt.

## Deployment

1. Ensure that the `.env` variables are configured properly.
2. Install the necessary dependencies on the production server:

- npm install

3. Start the server in production mode:

- npm start
