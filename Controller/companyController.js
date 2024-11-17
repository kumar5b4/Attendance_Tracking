const Company = require('../Models/Company');

const addCompany = async (req, res) => {
    try {
        const { name, description, branches } = req.body;

        // Create a new company document with branches
        const company = new Company({
            name,
            description,
            branches
        });

        // Save the company to the database
        await company.save();

        // Respond with the company details including company_id
        res.status(201).json({
            message: "Company created successfully",
            company: {
                company_id: company._id,
                name: company.name,
                description: company.description,
                branches: company.branches
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { addCompany };
