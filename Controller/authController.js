const jwt = require('jsonwebtoken');
const User = require('../Models/Employee');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data (companyId, branchId, roleId) to req.user
        req.user = {
            _id: decoded._id,
            companyId: decoded.companyId,
            branchId: decoded.branchId,
            roleId: decoded.roleId
        };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authenticate;
