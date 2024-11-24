const mongoose = require("mongoose");

const RoleEnum = {
  MANAGER: 1,       // Manager
  HR: 2,            // HR
  SOFTWARE_DEV: 3,  // Software Developer
};

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  roleId: { type: Number, default: RoleEnum.MANAGER }, // Default role is Manager
});

const Employee = mongoose.model("employee", EmployeeSchema);

module.exports = { Employee , RoleEnum };


