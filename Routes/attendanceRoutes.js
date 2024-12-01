const express = require("express");
const { checkInOut  , getAttendanceByDate  , getEmployeeAttendance } = require("../Controller/checkInOut");
const jwt = require('jsonwebtoken');


const router = express.Router();


const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).json({ message: "Access token missing. Authorization denied." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    // Wrapping jwt.verify inside a try-catch to handle any synchronous errors
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      try {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token. Authorization denied." });
        }
      
      console.log(user)
        req.user = { 
          branchId : user.branchId,
          employeeId: user.id,
          email: user.email,
          roleId: user.roleId, // Assuming role is stored as "role" in the token payload
          companyId: user.companyId, // Assuming companyId is part of the token payload
        };

        next(); // Proceed to the next middleware or route handler
      } catch (err) {
        console.error('Error inside JWT verification callback:', err);
        return res.status(500).json({ message: "Internal Server Error. Please try again later." });
      }
    });
  } catch (err) {
    // Handle any unexpected errors that might happen outside the jwt.verify callback
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: "Internal Server Error. Please try again later." });
  }
};


const ManagerOrHr = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    debugger;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
    req.user = decoded; // Add user data to the request
     console.log(decoded)
    // Check roleId
    if (![1, 2].includes(req.user.roleId)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next(); // Proceed to the route handler
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
}

// POST route for company registration
router.post("/checkInOut", authenticateToken ,  checkInOut);
router.get("/attendance", ManagerOrHr , getAttendanceByDate);
router.post("/getAttendanceByDateRange", authenticateToken , getEmployeeAttendance  )

module.exports = router;
