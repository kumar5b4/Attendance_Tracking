const mongoose = require("mongoose");

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to Employee model
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // Reference to Branch model
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company", // Reference to Company model
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkInTime: {
    type: Date,
    required: false,
  },
  checkOutTime: {
    type: Date,
    required: false,
  },
  latitude: {
    type: Number,
    required: false, // Optional for check-in/check-out
  },
  longitude: {
    type: Number,
    required: false, // Optional for check-in/check-out
  },
  status: {
    type: String,
    enum: ['Checked In', 'Checked Out'],
    required: false,
  },
});

// Attendance Model
const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;
