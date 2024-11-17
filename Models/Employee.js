const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company.branches', required: true },
    roleId: { type: Number, required: true, enum: [1, 2, 3] }, // 1: Manager, 2: HR, 3: Employee
    roleName: { type: String, required: true },  // Role name (Manager, HR, Employee)
    designation: { type: String, required: true },  // Job title/position
    password: { type: String, required: true },  // Employee password
    mobile: { type: String, required: true },  // Employee mobile number
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash the password before saving
employeeSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('Employee', employeeSchema);
