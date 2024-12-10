const express = require('express');
const { logInOut } = require('../Controller/locationController');  // Make sure the file name matches exactly
const authenticate = require('../Middleware/auth');  // Ensure 'middleware' is the correct folder name

const router = express.Router();

/**
 * @swagger
 * /location:
 *   post:
 *     summary: Employee login/logout based on location
 *     description: Logs an employee in or out based on their location. This action is authenticated.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged in/out
 *       401:
 *         description: Unauthorized, authentication failed
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, logInOut);  // I've changed '/location' to '/' because the full route will be '/api/location' in the app.js

module.exports = router;
