const jwt = require('jsonwebtoken');
const User = require('../Models/Employee');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log(token)
        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required' });
        }
        console.log()
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
    
        req.user = {
            id: decoded.id,
            companyId: decoded.companyId,
            branchId: decoded.branchId,
            roleId: decoded.roleId
        };
        // if(!_id || !companyId || !branchId || !roleId){
        //     res.status(401).json({ error: 'Authentication failed' });
        // }
        console.log(req.user)
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authenticate;
