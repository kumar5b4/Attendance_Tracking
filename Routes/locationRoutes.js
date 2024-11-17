const express = require('express');
const { logInOut } = require('../Controller/locationController');  // Make sure the file name matches exactly
const authenticate = require('../Middleware/auth');  // Ensure 'middleware' is the correct folder name

const router = express.Router();

// Route for employee login/logout based on location
router.post('/', authenticate, logInOut);  // I've changed '/location' to '/' because the full route will be '/api/location' in the app.js

module.exports = router;
