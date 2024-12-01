const express = require("express");
const { checkInOut  , getAttendanceByDate  , getEmployeeAttendance } = require("../Controller/checkInOut");
const { authenticateToken ,  ManagerOrHr  } = require('../Middleware/auth')

const jwt = require('jsonwebtoken');


const router = express.Router();



// POST route for company registration
router.post("/checkInOut", authenticateToken ,  checkInOut);
router.get("/attendance", ManagerOrHr , getAttendanceByDate);
router.post("/getAttendanceByDateRange", authenticateToken , getEmployeeAttendance  )

module.exports = router;
