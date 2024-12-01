const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  branchName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;
