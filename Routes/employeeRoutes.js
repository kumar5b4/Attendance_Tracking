const express = require('express');
const { addEmployee , employeeLogin} = require('../Controller/employeeController');

const router = express.Router();


const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if the Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Access token missing. Authorization denied." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
   debugger;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token. Authorization denied." });
    }

    // Attach user details to the request object
    req.user = {
      email: user.email,
      roleId: user.roleId , // Assuming role is stored as "role" in the token payload
      companyId: user.companyId, // Assuming companyId is part of the token payload
    };

    next(); // Proceed to the next middleware or route handler
  });
};




// POST route to add a new employee to a specific branch in a company
router.post('/add-employee', authenticateToken, addEmployee);
router.post('/employee-login', employeeLogin)

module.exports = router;

