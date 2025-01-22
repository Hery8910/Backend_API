// /routes/userRoutes.js
const { Router } = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, validateRegister } = require('../controllers/userControllers/registerUser');
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");
const loginUser = require('../controllers/userControllers/loginUser');
const {verifyEmail, resendVerificationEmail} = require('../controllers/userControllers/verifyEmail');
const forgotPassword = require('../controllers/userControllers/forgotPassword')
const getUserProfile = require('../controllers/userControllers/getUserProfile');
const resetPassword = require('../controllers/userControllers/resetPassword');
const logoutUser = require('../controllers/userControllers/logoutUser');


const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or validation error
 */
router.post('/register', registerLimiter, validateRegister, registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials or unverified account
 */
router.post('/login',loginLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword );
router.post('/reset-password', resetPassword );
router.post('/resend-verification', resendVerificationEmail);
router.get('/verify-email/:token', verifyEmail); 
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Not authorized
 */
router.get('/profile', protect, getUserProfile);

module.exports = router;
