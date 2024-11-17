const express = require('express');
const { loginUser } = require('../Controller/loginController');

const router = express.Router();

router.post('/', loginUser);

module.exports = router;
