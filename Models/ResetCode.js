const mongoose = require('mongoose');

// Define the schema
const ResetCodeSchema = new mongoose.Schema({
    email: { type: String, required: true },
    passcode: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: () => Date.now() + 10 * 60 * 1000 } // 10 minutes
});

// Add a TTL index for automatic expiration
ResetCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create and export the model
const ResetCode = mongoose.model('ResetCode', ResetCodeSchema);
module.exports = ResetCode;
