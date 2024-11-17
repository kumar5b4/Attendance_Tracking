const express = require('express');
const { addRole, removeRole } = require('../Controller/roleController');
const authenticate = require('../Middleware/auth');

const router = express.Router();

// Route to add or change a user's role (HR/Employee)
router.post('/:userId/role', authenticate, addRole);

// Route to remove a user's role
router.delete('/:userId/role', authenticate, removeRole);

module.exports = router;
