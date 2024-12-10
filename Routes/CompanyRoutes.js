const express = require("express");
const { register, login, getCompanies } = require("../Controller/companyController");
const jwt = require('jsonwebtoken');
const { authenticateAndCheckRole } = require('../Middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new company
 *     description: Registers a new company in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company successfully registered
 *       400:
 *         description: Bad request (validation error)
 *       500:
 *         description: Internal server error
 */
router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to a company account
 *     description: Authenticates and logs in the company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in, returns a JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /getAllCompanies:
 *   get:
 *     summary: Get all companies
 *     description: Retrieves a list of all companies from the database.
 *     security:
 *       - bearerAuth: []  # JWT Token required for this route
 *     responses:
 *       200:
 *         description: A list of all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   companyName:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get("/getAllCompanies", authenticateAndCheckRole, getCompanies);

module.exports = router;
