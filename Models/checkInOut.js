const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    loginTime: { type: Date, required: true },  // Store check-in (login) time
    logoutTime: { type: Date }, // Store check-out (logout) time
    date: { type: Date, default: Date.now }, // Store date for daily attendance
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

module.exports = mongoose.model("Attendance", attendanceSchema);
