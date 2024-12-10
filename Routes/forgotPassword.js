const express = require('express');
const { sendResetCode, verifyPasscode } = require('../controller/loginController');
const router = express.Router();

/**
 * @swagger
 * /send-reset-code:
 *   post:
 *     summary: Send reset code
 *     description: Sends a reset code to the user's email address for resetting the password.
 *     requestBody:
 *       description: User email to send the reset code.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user to send the reset code to.
 *     responses:
 *       200:
 *         description: Reset code sent successfully.
 *       400:
 *         description: Invalid email or other input error.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/send-reset-code', sendResetCode); // Route to send the reset code

/**
 * @swagger
 * /verify-reset-code:
 *   post:
 *     summary: Verify reset code
 *     description: Verifies the reset code entered by the user.
 *     requestBody:
 *       description: User email and reset code to verify.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user whose reset code is being verified.
 *               resetCode:
 *                 type: string
 *                 description: The reset code entered by the user.
 *     responses:
 *       200:
 *         description: Reset code verified successfully.
 *       400:
 *         description: Invalid reset code or email.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/verify-reset-code', verifyPasscode); // Route to verify the reset code

module.exports = router;
