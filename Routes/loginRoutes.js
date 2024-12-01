const express = require('express');


const router = express.Router();

router.post('/', loginUser);

module.exports = router;
