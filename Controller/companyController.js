const bcrypt = require("bcrypt");
const Company = require("../Models/Company"); // Import the Company model
const Branch = require('../Models/Branch')
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const {
      companyName,
      email,
      password,
      startDate,
      area,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (
      !companyName ||
      !email ||
      !password ||
      !startDate ||
      !area ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the company already exists (to avoid duplicates)
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "Company with this email already exists." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save a new company
    const newCompany = new Company({
      companyName,
      email,
      password: hashedPassword,
      startDate,
      area,
      isApproved: false,
      latitude,
      longitude,
    });

    const savedCompany = await newCompany.save();
    console.log(savedCompany);
    res.status(201).json({
      message: "Company registered successfully.",
      company: {
        id: savedCompany._id,
        isApproved : savedCompany.isApproved , 
        companyName: savedCompany.companyName,
        email: savedCompany.email,
        startDate: savedCompany.startDate,
        area: savedCompany.area,
        latitude: savedCompany.latitude,
        longitude: savedCompany.longitude,
      },
    });
  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



const getCompanies = async (req,res) =>{
  try {
    debugger;
    const companiesList = await Company.find();
    if(!companiesList){
      return res.status(204).json({ message: 'No Companies Found' });
    }
    return res.status(200).json({message : `Companies Found of total ${companiesList.length}`, List : companiesList} )
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
  
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
        debugger;
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      // Find user by email
      const user = await Company.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
       console.log(user);
      // Compare the password with the hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
  
      const token = jwt.sign(
        { email: user.email, roleId: 4 ,companyId : user.companyId  },
        process.env.JWT_SECRET_KEY, // Replace with your own secret key
        { expiresIn: '24h' } // Optional expiration time
      );
  
      // Send response with the token
      res.status(200).json({
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          email: user.email,
          companyId : user.companyId,
          roleId : 4 
        }
      });
  
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

module.exports = { register ,  login , getCompanies};
