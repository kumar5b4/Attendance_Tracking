const express = require('express');
const { sendResetCode, verifyPasscode } = require('../controller/loginController');
const router = express.Router();

router.post('/send-reset-code', sendResetCode); // Route to send the reset code
router.post('/verify-reset-code', verifyPasscode); // Route to verify the reset code

module.exports = router;
