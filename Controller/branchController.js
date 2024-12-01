require("dotenv").config(); 
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Company = require("../Models/Company");
const Branch = require("../Models/Branch");
const Employees = require("../Models/Employee")
const { Manager, RoleEnum } = require("../Models/Employee");


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 


const getBranchesByCompanyId = async (req, res) => {
  try {
      const { companyId } = req.params;

      const isExist = await Company.findOne({companyId : companyId});
      if(!isExist){
        return res.status(404).json({message:'No company details found'})
      }
      const branches = await Branch.find({ companyId :  companyId });

      if (branches.length === 0) {
          return res.status(404).json({ message: 'No branches found for the given company ID.' });
      }

      res.status(200).json({message : "Branch details Found", BranchDetails : branches });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
  }
};

const getBranchDetailsByBranchId = async (req ,res) =>{
   try {
    const { branchId } = req.params;

    const branchDetails = await Branch.findOne({branchId : branchId});
  
   
    if (!branchDetails) {
        return res.status(404).json({ message: 'No branches found for the given company ID.' });
    }
    
    const employeesList = await Employees.find({branchId : branchId})

    res.status(200).json({message : "Branch details Found", branchDetails : branchDetails  , employeesInBranch : employeesList  });
  
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
  } 

  const addBranch = async (req, res) => {
    try {
        debugger;
        console.log(req.user,"companydetails");
        const  companyId  = req.user.companyId;
        const { branchName, area, latitude, longitude, date  } = req.body;
         console.log(req.user)
        if (!branchName || !area || latitude === undefined || longitude === undefined || !date || !companyId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }


        if (!req.user || req.user.roleId !==4) {
            return res.status(403).json({ message: 'Access denied. Only users with role 4 can add branches.' });
        }

        // Check if the companyId in token matches the companyId in the request body
        if (req.user.companyId !== companyId) {
            return res.status(403).json({ message: 'Invalid companyId. Token and body companyId must match.' });
        }

    
        const company = await Company.findOne({companyId : companyId});
        console.log(company);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Ensure the company is approved before allowing branch addition
        if (!company.isApproved) {
            return res.status(400).json({ message: 'Company is not approved to add branches.' });
        }

        // Create and save the new branch
        const newBranch = new Branch({
            branchName,
            area,
            latitude,
            longitude,
            date,
            companyId, // Associate branch with the company
        });

        const savedBranch = await newBranch.save();

        res.status(201).json({
            message: 'Branch added successfully.',
            branch: savedBranch,
        });

    } catch (error) {
        console.error('Error adding branch:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};






module.exports = {  getBranchesByCompanyId , getBranchDetailsByBranchId , addBranch};
