const express = require('express');
const { loginUser } = require('../Controller/authController');  // Assuming loginUser is defined elsewhere

const router = express.Router();

/**
 * @swagger
 * login:
 *   post:
 *     summary: User login
 *     description: Logs in a user by providing a username and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated access
 *       400:
 *         description: Invalid input or missing credentials
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.post('/', loginUser);

module.exports = router;
