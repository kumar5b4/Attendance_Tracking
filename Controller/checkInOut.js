const Attendance = require("../Models/Attendance");
const Employee = require("../Models/Employee");
const Branch = require("../Models/Branch");

// Function to calculate distance between two coordinates in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

const checkInOut = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { employeeId } = req.user; 

    console.log(employeeId , "employeeId")
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

     console.log(res.user,"resopnse");
    const employee = await Employee.findOne({ email : email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const branch = await Branch.findOne({branchId : employee.branchId});
    if (!branch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    // Calculate distance from branch
    const distance = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);

    if (distance > 100) {
      return res.status(403).json({ message: "You are not within 100 meters of the branch." });
    }

    // Get today's date (in YYYY-MM-DD format)
    const today = new Date().toISOString().split("T")[0];

    // Check if an attendance record already exists for today
    let attendance = await Attendance.findOne({
      employeeId,
      date: today,
      branchId: employee.branchId,
    });

    if (!attendance) {
      // Create a new attendance record if none exists
      attendance = new Attendance({
        employeeId,
        branchId: employee.branchId,
        companyId: employee.companyId,
        date: today,
        checkInTime: new Date(),
      });
    } else if (!attendance.checkOutTime) {
      // If attendance exists and no check-out, set the check-out time
      attendance.checkOutTime = new Date();
    } else {
      return res.status(400).json({ message: "You have already checked out for today." });
    }

    // Save attendance
    await attendance.save();

    res.status(200).json({
      message: attendance.checkOutTime ? "Checked out successfully." : "Checked in successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Error during check-in/out:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { checkInOut };
