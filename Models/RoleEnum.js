const mongoose = require('mongoose');

const roleEnumSchema = new mongoose.Schema({
  roleId: {
    type: Number,
    required: true,
    unique: true,
    enum: [1, 2, 3], // MANAGER, HR, SOFTWARE_DEV
  },
  roleName: {
    type: String,
    required: true,
    unique: true,
    enum: ['MANAGER', 'HR', 'SOFTWARE_DEV'], // Role names
  },
});

const RoleEnum = mongoose.model('RoleEnum', roleEnumSchema);

module.exports = RoleEnum;
