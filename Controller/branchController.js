require("dotenv").config(); 
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Company = require("../Models/Company");
const Branch = require("../Models/Branch");
const { Manager, RoleEnum } = require("../Models/Employee");


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 

// Middleware: Validate JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token missing or invalid." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.companyId = decoded.companyId; // Attach companyId to the request
    req.email = decoded.email;
    req.roleId = decoded.roleId; // Include roleId from the token
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};


const verifyRoleAccess = (req, res, next) => {
  if (req.roleId !== RoleEnum.MANAGER || req.roleId != RoleEnum.HR) {
    return res.status(403).json({ message: "Only Managers and Hr can perform this action." });
  }
  next();
};


// POST: Add a new branch


router.post("/add-employee", authenticateToken, verifyRoleAccess, async (req, res) => {
  try {
    const { branchId, name, email, password, roleId } = req.body;

    // Validate roleId for employee (must be HR or Software Developer)
    if (![RoleEnum.HR, RoleEnum.SOFTWARE_DEV].includes(roleId)) {
      return res.status(400).json({ message: "Invalid role assigned to employee." });
    }

    // Validate input
    if (!branchId || !name || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the branch by branchId and ensure it belongs to the same company
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    if (branch.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: "You are not authorized to add employees to this branch." });
    }

    // Hash the password for the new employee
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new employee (Manager, HR, or Software Developer)
    const newEmployee = new Manager({
      name,
      email,
      password: hashedPassword,
      companyId: req.companyId,
      branchId,
      roleId, // The roleId could be 2 for HR or 3 for Software Developer
    });

    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      message: "Employee added successfully.",
      employee: {
        id: savedEmployee._id,
        name: savedEmployee.name,
        email: savedEmployee.email,
        branchId: savedEmployee.branchId,
        roleId: savedEmployee.roleId, // Include roleId in the response
      },
    });
  } catch (error) {
    console.error("Error adding employee:", error.message);
    res.status(500).json({ message: error.message || "Internal server error." });
  }
});

module.exports = {addBranch};
