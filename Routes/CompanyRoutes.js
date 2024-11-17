const express = require('express');
const Company = require('../Models/Company');

const router = express.Router();

// POST route to add a new company
router.post('/', async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
