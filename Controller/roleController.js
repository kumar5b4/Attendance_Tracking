const User = require('../Models/Employee');

// Function to add or change the role of a user (HR/Employee)
const addRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { roleId } = req.body;  // roleId 2 for HR, 3 for Employee
        
        // Get the logged-in user's details
        const { roleId: userRoleId, companyId, branchId } = req.user;

        // Check if the user is trying to assign a role they are not allowed to
        if (userRoleId === 3) {
            return res.status(403).json({ error: "Employees cannot add or change roles" });
        }

        // Manager (roleId 1) can add HR (roleId 2) or Employee (roleId 3)
        if (userRoleId === 1) {
            if (roleId !== 2 && roleId !== 3) {
                return res.status(400).json({ error: "Managers can only assign HR (roleId 2) or Employee (roleId 3)" });
            }
        }
        
        // HR (roleId 2) can only add Employee (roleId 3)
        if (userRoleId === 2 && roleId !== 3) {
            return res.status(400).json({ error: "HRs can only assign Employee (roleId 3)" });
        }

        // Find the user to be updated
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate if Manager tries to remove their own role
        if (userRoleId === 1 && user.roleId === 1) {
            return res.status(403).json({ error: "Managers cannot change the role of other Managers" });
        }
         // Validate if Manager tries to remove their own role
         if (userRoleId === 2 && user.roleId === 2) {
            return res.status(403).json({ error: "Hr's cannot change the role of other Hr's" });
        }
        // Validate the roleId and update the user's role
        user.roleId = roleId;
        await user.save();

        res.status(200).json({ message: `User role changed to ${roleId === 2 ? 'HR' : roleId === 3 ? 'Employee' : 'Unknown'}`, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to remove a user's role (Remove HR/Employee)
const removeRole = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get the logged-in user's details
        const { roleId: userRoleId } = req.user;

        // HR (roleId 2) and Manager (roleId 1) can remove employees (roleId 3)
        if (userRoleId === 3) {
            return res.status(403).json({ error: "Employees cannot remove other users" });
        }

        // Manager (roleId 1) can remove HR (roleId 2) or Employee (roleId 3)
        if (userRoleId === 1) {
            // Validate if Manager tries to remove another Manager
            const user = await User.findById(userId);
            if (user.roleId === 1) {
                return res.status(403).json({ error: "Managers cannot remove other Managers" });
            }
        }

    
        // HR (roleId 2) can only remove Employee (roleId 3)
        if (userRoleId === 2) {
            const user = await User.findById(userId);
            if (user.roleId !== 3 ) {
                return res.status(403).json({ error: "HRs can only remove employees" });
            }
        }

        // Remove user role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Set role to null or handle based on business logic (here just delete the user)
        await user.remove();

        res.status(200).json({ message: "User role removed successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addRole, removeRole };
