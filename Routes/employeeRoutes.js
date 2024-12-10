const express = require('express');
const { addEmployee, employeeLogin } = require('../Controller/employeeController');
const { authenticateToken } = require('../Middleware/auth');
const router = express.Router();

const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /add-employee:
 *   post:
 *     summary: Add a new employee
 *     description: Adds a new employee to a specific branch in the company.
 *     security:
 *       - bearerAuth: []  # JWT Token required for this route
 *     requestBody:
 *       description: Employee object that needs to be added to the company
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the employee
 *               email:
 *                 type: string
 *                 description: The email address of the employee
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the employee
 *               branchId:
 *                 type: string
 *                 description: The branch ID where the employee will be added
 *               position:
 *                 type: string
 *                 description: The job position of the employee
 *     responses:
 *       200:
 *         description: Employee successfully added
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/add-employee', authenticateToken, addEmployee);

/**
 * @swagger
 * /employee-login:
 *   post:
 *     summary: Employee login
 *     description: Allows an employee to log in with their credentials.
 *     requestBody:
 *       description: Employee login credentials (email and password)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the employee
 *               password:
 *                 type: string
 *                 description: The password of the employee
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/employee-login', employeeLogin);

module.exports = router;
