const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../Models/Company'); /// Assuming you have the User model
const router = express.Router();



module.exports = { login };
