const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../server"); // Ensure 'app' is exported from server.js
const User = require("../models/User"); // Ensure User model is exported for testing

// Clean the database before each test
beforeEach(async () => {
  await User.deleteMany({});
});

// Close the MongoDB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test suite for user registration
describe("User Registration", () => {
  // Test for successful registration and sending of verification email
  it("Should send a verification email upon registration", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Verification email sent. Please check your email.");
  });

  // Test for validation error when required fields are missing
  it("Should return validation error if required fields are missing", async () => {
    const res = await request(app).post("/api/users/register").send({
      email: "testuser@example.com", // Missing name and password
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Name is required");
  });

  // Test for handling duplicate user registration
  it("Should not allow registration if email already exists", async () => {
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      password: await bcrypt.hash("password123", 10),
    });

    const res = await request(app).post("/api/users/register").send({
      name: "Another User",
      email: "existing@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });
});

// Test suite for user login
describe("User Login", () => {
  // Test for successful login with valid credentials for verified user
  it("Should allow login with valid credentials for verified user", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: hashedPassword,
      isVerified: true,
    });

    const res = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token"); // Ensure token is returned
  });

  // Test for login failure due to incorrect credentials
  it("Should not allow login with incorrect credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });

  // Test for login failure when the user is not verified
  it("Should not allow login for unverified user", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: hashedPassword,
      isVerified: false, // User is not verified
    });

    const res = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Please verify your account before logging in.");
  });
});

// Test suite for email verification
describe("Email Verification", () => {
  // Test for successful email verification
  it("Should verify email and activate user account", async () => {
    await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
      isVerified: false, // User is not yet verified
    });

    const verificationToken = jwt.sign({ email: "testuser@example.com" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const res = await request(app).get(`/api/users/verify-email/${verificationToken}`);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Account successfully verified");
  });

  // Test for failure due to invalid or expired token
  it("Should return error for invalid or expired token", async () => {
    const res = await request(app).get(`/api/users/verify-email/invalid-token`);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid or expired token");
  });
});

// Protected Routes

// Test for profile access and service request creation
describe("Protected Routes", () => {
  // Test for failure when no token is provided
  it("Should return 401 if no token is provided when accessing profile", async () => {
    const res = await request(app).get("/api/users/profile");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Not authorized, no token");
  });

  // Test for successful profile access with valid token
  it("Should return user profile if valid token is provided", async () => {
    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
      isVerified: true,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Test User");
  });

  // Test for failure when creating a service request without a token
  it("Should return 401 when creating a service request without token", async () => {
    const res = await request(app).post("/api/services").send({
      serviceType: "Cleaning",
      date: "2024-09-12",
      time: "10:00",
      address: "123 Test St",
      notes: "General cleaning",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Not authorized, no token");
  });

  // Test for successful service request creation with valid token
  it("Should create service request with valid token", async () => {
    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
      isVerified: true,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const res = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        serviceType: "Cleaning",
        date: "2024-09-12",
        time: "10:00",
        address: "123 Test St",
        notes: "General cleaning",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("serviceType", "Cleaning");
  });
});

// Rate Limiting Test
describe("Rate Limiting", () => {
  // Test to block login after multiple failed attempts
  it("Should block login after 5 failed attempts", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post("/api/users/login").send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });
    }

    const res = await request(app).post("/api/users/login").send({
      email: "nonexistent@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(429); 
    expect(res.body).toHaveProperty("message", "Too many login attempts, please try again later");
  });
});

// CORS Test
describe("CORS Protection", () => {
  // Test for allowing requests from the allowed origin
  it("Should allow requests from the allowed origin", async () => {
    const res = await request(app)
      .get("/api/users/login")
      .set("Origin", process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL);

      expect(res.statusCode).toEqual(403);
  });

  // Test for blocking requests from disallowed origin
  it("Should block requests from disallowed origin", async () => {
    const res = await request(app)
      .get("/api/users/login")
      .set("Origin", "http://malicious-site.com");

    expect(res.statusCode).toEqual(403); 
    expect(res.body).toHaveProperty("message", "Not allowed by CORS");
  });
});
