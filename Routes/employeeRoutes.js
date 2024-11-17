const express = require('express');
const { addEmployee } = require('../Controller/employeeController');

const router = express.Router();


const authenticate = require('../Middleware/auth');

// POST route to add a new employee to a specific branch in a company
router.post('/', authenticate, addEmployee);

module.exports = router;

