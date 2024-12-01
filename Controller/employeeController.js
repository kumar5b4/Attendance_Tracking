const Employee = require("../Models/Employee");
const Branch = require("../Models/Branch");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const RoleEnum = require("../Models/RoleEnum");
const addEmployee = async (req, res) => {
  try {
    const { name, email, password, branchId, roleId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !branchId || roleId === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }


    if (!req.user) {
      return res.status(403).json({ message: "Access denied. Unauthorized user." });
    }

    const userRoleId = req.user.roleId;
    debugger;
    // Role-based permission logic
    if (
      (userRoleId === 4 && userRoleId === RoleEnum.MANAGER) || // Role 4 can only add Managers
      (userRoleId === RoleEnum.MANAGER && ![RoleEnum.HR, RoleEnum.SOFTWARE_DEV].includes(roleId)) || // Manager can add HR and Software Dev
      (userRoleId === RoleEnum.HR && roleId !== RoleEnum.SOFTWARE_DEV) || // HR can only add Software Dev
      (userRoleId === RoleEnum.SOFTWARE_DEV) // Software Dev can't add anyone
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. You do not have permission to add this role." });
    }
    debugger;
    console.log("branchId", branchId);

    const branch = await Branch.findOne({ branchId: branchId });

    if (!branch || branch.companyId.toString() !== req.user.companyId) {
      return res.status(403).json({ message: "Invalid branch or unauthorized access." });
    }

    // Hash the employee's password
    const hashedPassword = await bcrypt.hash(password, 10);


    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      companyId: req.user.companyId,
      branchId,
      roleId: 1
    });

    console.log("New Employee:", newEmployee);

    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      message: "Employee added successfully.",
      employee: {
        id: savedEmployee._id,
        name: savedEmployee.name,
        email: savedEmployee.email,
        roleId: savedEmployee.roleId,
        branchId: savedEmployee.branchId,
      },
    });














  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    debugger;
    const employee = await Employee.findOne({ email: email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    console.log(employee);
    
    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: employee._id,
        email: employee.email,
        roleId: employee.roleId,
        companyId: employee.companyId,
        branchId: employee.branchId
      },
      process.env.JWT_SECRET_KEY, // Use your secret key
      { expiresIn: "24h" } // Token expiration time
    );

    // Respond with the token
    res.status(200).json({
      message: "Login successful.",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        roleId: employee.roleId,
        companyId: employee.companyId,
        branchId: employee.branchId,
      },
    });
  } catch (error) {
    console.error("Error during employee login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


module.exports = { addEmployee, employeeLogin };
