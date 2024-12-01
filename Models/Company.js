const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean },
  startDate: { type: Date, required: true },
  area: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("Company", companySchema);
