const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../Models/Employee'); // Assuming Employee is your model

// Login Controller
const loginUser = async (req, res) => {
    try {
        const { mobile, email, password } = req.body;
        console.log(email,password)
        // Validate the input
        if (!mobile && !email) {
            return res.status(400).json({ error: "Please provide mobile or email." });
        }
        if (!password) {
            return res.status(400).json({ error: "Please provide your password." });
        }

        // Find user by mobile or email
        let user;
        if (mobile) {
            user = await Employee.findOne({ mobile });
        } else if (email) {
            user = await Employee.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the hashed password with the provided password
        // const isMatch = await bcrypt.compare(password, user.password);
         console.log(password , user.password)
        if (!password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        console.log(user._id)
        const token = jwt.sign(
            { id: user._id, roleId: user.roleId , companyId: user.companyId , branchId : user.branchId},  // Payload: user ID and role ID
            process.env.JWT_SECRET_KEY,              // Secret key for JWT (stored in .env)
            { expiresIn: '24h' }                     // Token expires in 1 hour
        );

        // Send the response with the token
        res.status(200).json({
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { loginUser };
