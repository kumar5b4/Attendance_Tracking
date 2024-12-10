const express = require("express");
const { checkInOut, getAttendanceByDate, getEmployeeAttendance } = require("../Controller/checkInOut");
const { authenticateToken, ManagerOrHr } = require('../Middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * @swagger
 * /checkInOut:
 *   post:
 *     summary: Check in or out the employee
 *  tags:
 *       - Attendance
 *     description: Allows the employee to check in or out based on their current status.
 *     security:
 *       - bearerAuth: []  # JWT Token required for this route
 *     responses:
 *       200:
 *         description: Successfully checked in or out
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request (e.g., invalid data)
 */
router.post("/checkInOut", authenticateToken, checkInOut);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get attendance by date
 *     description: Retrieves attendance information based on the date, accessible only by Managers or HR.
 *     security:
 *       - bearerAuth: []  # JWT Token required for this route
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not authorized to access)
 */
router.get("/attendance", ManagerOrHr, getAttendanceByDate);

/**
 * @swagger
 * /getAttendanceByDateRange:
 *   post:
 *     summary: Get employee attendance within a date range
 *     description: Retrieves the attendance data of employees within a specific date range.
 *     security:
 *       - bearerAuth: []  # JWT Token required for this route
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance data
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request (e.g., invalid data)
 */
router.post("/getAttendanceByDateRange", authenticateToken, getEmployeeAttendance);

module.exports = router;
