const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const RoleEnum = require("./RoleEnum"); // Import RoleEnum

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  roleId: { 
    type: Number, 
    required: true, 
  },
});

// Hash password before saving it
EmployeeSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Add method to validate password
EmployeeSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
