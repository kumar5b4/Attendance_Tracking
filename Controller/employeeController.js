const Employee = require('../Models/Employee');
const Company = require('../Models/Company');

// Controller function to add an employee to a specific branch
const addEmployee = async (req, res) => {
    try {
        const { employeeId, name, email, roleId, roleName, designation, password, mobile } = req.body;

        // Get companyId, branchId, and roleId from the authenticated user's token (from req.user)
        const { companyId, branchId, roleId: userRoleId } = req.user;

        // Validate role: Only Manager (1) or HR (2) can add employees
        if (![1, 2].includes(userRoleId)) {
            return res.status(403).json({ error: "You do not have permission to add employees" });
        }

        // Validate that the user is adding an employee to their own company and branch
        if (!companyId || !branchId) {
            return res.status(400).json({ error: "Company or branch details are missing for the user" });
        }

        // Check if the employeeId or email already exists
        const existingEmployee = await Employee.findOne({ $or: [{ employeeId }, { email }] });
        if (existingEmployee) {
            return res.status(400).json({ error: "Employee with this ID or email already exists" });
        }

        // Create and save the new employee
        const employee = new Employee({
            employeeId,
            name,
            email,
            companyId,  // Use companyId from logged-in user
            branchId,   // Use branchId from logged-in user
            roleId,     // Role ID of the new employee (this can be passed in the request body)
            roleName,
            designation,
            password,
            mobile
        });

        await employee.save();

        res.status(201).json({ message: "Employee added successfully", employee });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { addEmployee };
