const express = require("express");
const { register, login  , getCompanies } = require("../Controller/companyController");
const jwt = require('jsonwebtoken');
const { authenticateAndCheckRole } = require('../Middleware/auth')

const router = express.Router();




router.post("/register", register);
router.post("/login",  login);
router.get("/getAllCompanies",getCompanies)

module.exports = router;
