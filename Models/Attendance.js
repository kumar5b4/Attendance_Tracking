// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String ,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        unique: true  // Ensure one attendance record per day
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'absent'  // Default to absent
    },
    logInTime: Date,
    logOutTime: Date
});

module.exports = mongoose.model('Attendance', attendanceSchema);
