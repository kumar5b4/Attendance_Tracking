const express = require("express");
const { register, addBranch ,login } = require("../Controller/companyController");
const jwt = require('jsonwebtoken');


const router = express.Router();


const authenticateAndCheckRole = (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required.' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY );
       
   
      req.user = decoded;
       console.log(decoded)
      // Check if the roleId is 4
      if (decoded.roleId !== 4) {
        return res.status(403).json({ message: 'Permission denied. Insufficient role.' });
      }
  
      // If everything is fine, proceed to the next middleware/controller
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };


// POST route for company registration
router.post("/register", register);
router.post("/login",  login);
router.post("/add-branch", authenticateAndCheckRole,  addBranch );
module.exports = router;
