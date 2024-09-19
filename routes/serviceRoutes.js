// /routes/serviceRoutes.js
const { Router } = require('express');
const { getServiceRequests, createServiceRequest, validateServiceRequest, setWorkSchedule, confirmServiceRequests } = require('../controllers/serviceControllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');
const { checkAvailability} = require('../controllers/scheduleController/checkAvailability')
const router = Router();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service request
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *                 description: The type of service (e.g., cleaning)
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the service
 *               time:
 *                 type: string
 *                 description: The time of the service
 *               address:
 *                 type: string
 *                 description: Service address
 *               notes:
 *                 type: string
 *                 description: Additional notes for the service
 *     responses:
 *       201:
 *         description: Service request created successfully
 *       400:
 *         description: Validation error or missing data
 */
router.post('/', validateServiceRequest, protect, createServiceRequest);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all service requests (Admin only)
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all service requests
 *       403:
 *         description: Unauthorized access (Admin only)
 */
router.get('/', protect, admin, getServiceRequests);

router.post('/set-work-schedule', protect, admin, setWorkSchedule)

router.post('/check-availability', protect, checkAvailability)

router.post('/confirm-service/:serviceId', protect, admin, confirmServiceRequests)

module.exports = router;
