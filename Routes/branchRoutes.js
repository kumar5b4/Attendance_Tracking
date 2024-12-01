const express = require("express");
const { getBranchesByCompanyId  , getBranchDetailsByBranchId  , addBranch } = require("../Controller/branchController");
const jwt = require('jsonwebtoken');
const { authenticateAndCheckRole } = require('../Middleware/auth')

const router = express.Router();




router.post("/getAllBranchesByComapnyId" ,authenticateAndCheckRole , getBranchesByCompanyId );
router.post("/getBranchDetailsByBranchId",  authenticateAndCheckRole ,getBranchDetailsByBranchId );
router.post("/add-branch", authenticateAndCheckRole,  addBranch );


module.exports = router;
