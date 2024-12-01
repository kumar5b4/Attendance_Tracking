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
    const { employeeId } = req.user; // Assuming employeeId is available in the request's user object
    console.log(req.user)
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }
    debugger;
    // Find the employee based on employeeId
    const employee = await Employee.findOne({_id: employeeId})
    console.log(employee,"employee")
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    console.log(employee.branchId,"branchId")
    const branch = await Branch.findOne({ branchId: employee.branchId });
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
        status : "Checked In"
      });
    } else if (!attendance.checkOutTime) {
      // If attendance exists and no check-out, set the check-out time
      attendance.checkOutTime = new Date();
      attendance.status= "Checked Out"
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


const  getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
     
    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const attendances = await Attendance.find({
      date: { $gte: startDate, $lt: endDate },
      branchId: req.user.branchId,  // Filter by branchId
    })
    .populate("employeeId", "name email roleId");
     console.log(attendances,"attendances");
    
      

    if (attendances.length === 0) {
      return res.status(404).json({ message: "No attendance records found for the given date." });
    }

    const result = attendances.map((attendance) => {
      const { checkInTime, checkOutTime } = attendance;
      let workingTime = null;

      if (checkInTime && checkOutTime) {
        const diffMs = new Date(checkOutTime) - new Date(checkInTime);
        workingTime = (diffMs / (1000 * 60 * 60)).toFixed(2); // Convert to hours
      }

      return {
        ...attendance.toObject(),
        workingTime: workingTime ? `${workingTime} hours` : "Incomplete",
      };
    });

    res.status(200).json({ attendances: result });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const moment = require("moment");  // Assuming moment.js for date comparison

const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, branchId } = req.body; // Assume startDate, endDate, and branchId are passed in query

    // Validate required parameters
    if (!employeeId || !startDate || !endDate || !branchId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    const statusList = ["Checked In", "Checked Out"];
    // Query to find attendances based on employeeId, branchId, and the date range
    const attendances = await Attendance.find({
      employeeId: req.user.employeeId,
      branchId: req.user.branchId,
      status: { $in: statusList }
    })
      .populate("employeeId", "name email roleId")  // Populate employee data
      .sort("date"); // Sort by date ascending to ensure correct date range

    // Initialize present and absent details
    let attendanceList = [];
    let presentDays = new Set();
    let absentDays = new Set();
    const allDates = generateDateRange(start, end);  // Generate all dates between start and end

    // Store present days in a Set for fast lookup
    attendances.forEach((attendance) => {
      const dateStr = moment(attendance.date).format("YYYY-MM-DD");
      if (attendance.checkInTime) {
        presentDays.add(dateStr);  // Add to present days
      }
    });

    // Build the attendance list with present/absent status for each date
    allDates.forEach((dateStr) => {
      if (presentDays.has(dateStr)) {
        attendanceList.push({ date: dateStr, status: "present" });
      } else {
        attendanceList.push({ date: dateStr, status: "absent" });
      }
    });

    // Get employee data from the first attendance record (if exists)
    const employeeData = attendances.length > 0 ? attendances[0].employeeId : {};

    res.status(200).json({
      employeeId,
      employeeName: employeeData.name, // Add employee name
      attendanceList,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to generate an array of dates between startDate and endDate
function generateDateRange(startDate, endDate) {
  const dateArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
    currentDate.setDate(currentDate.getDate() + 1); // Increment the date by 1
  }

  return dateArray;
}



module.exports = { checkInOut , getAttendanceByDate , getEmployeeAttendance };

