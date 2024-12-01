const express = require('express');
const { addEmployee , employeeLogin} = require('../Controller/employeeController');
const { authenticateToken } = require('../Middleware/auth')
const router = express.Router();


const jwt = require("jsonwebtoken");






// POST route to add a new employee to a specific branch in a company
router.post('/add-employee', authenticateToken, addEmployee);
router.post('/employee-login', employeeLogin)

module.exports = router;

