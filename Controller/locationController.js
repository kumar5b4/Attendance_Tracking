const Employee = require('../Models/Employee');
const { haversineDistance } = require('../utils/locationHelper');
const Attendance = require('../Models/Attendance')

// Office coordinates (latitude and longitude)
const officeLat = 12.9716; // example office latitude
const officeLon = 77.5946; // example office longitude
const allowedRadius = 50;  // 50 meters


const logInOut = async (req, res) => {
    try {
        const { latitude, longitude } = req.body; // Employee's current location
        debugger;
        // Check if location is provided
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Please allow access to your location" });
        }
        console.log(latitude ,longitude)
        // Calculate the distance between employee's location and the office
        const distance = parseInt(haversineDistance(officeLat, officeLon ,latitude, longitude));
        console.log(distance)
        // If the employee is within 50 meters of the office, allow login/logout
        if (distance <= allowedRadius) {
            const { id } = req.user; // Logged-in employee's ID from the token

            // Fetch employee details
            const employee = await Employee.findById(id);
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }

            // Toggle login status
            const isLoggedIn = !employee.isLoggedIn;
            employee.isLoggedIn = isLoggedIn;
            await employee.save();
            console.log(employee,"employee")
            // Find or create attendance record for today
            const today = new Date().toISOString().slice(0, 10);  // Get today's date in YYYY-MM-DD format
            let attendance = await Attendance.findOne({ _id: employee._id , date: today });
             console.log(attendance,"attendance");
            if (!attendance) {
                // If attendance for today does not exist, create a new one
                attendance = new Attendance({
                    employeeId: employee.employeeId,
                    date: today,
                    status: isLoggedIn ? 'present' : 'absent',
                    logInTime: isLoggedIn ? new Date() : null,
                    logOutTime: isLoggedIn ? null : new Date(),
                });
            } else {
                // If attendance exists, update the log-in/out time based on the status
                if (isLoggedIn) {
                    // If logging in, update the log-in time and status to present
                    attendance.status = 'present';
                    attendance.logInTime = new Date();
                    attendance.logOutTime = null;
                } else {
                    // If logging out, update the log-out time
                    attendance.logOutTime = new Date();
                }
            }

            await attendance.save();

            res.status(200).json({
                message: `Employee ${isLoggedIn ? "logged in" : "logged out"} successfully.`,
                attendance,  // Return attendance record
                employee,
            });
        } else {
            return res.status(400).json({ error: "You are not on office premises" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { logInOut };
