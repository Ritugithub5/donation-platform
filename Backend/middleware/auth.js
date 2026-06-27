const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const email = req.headers['x-auth-token'];
        
        if (!email) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Authentication failed' 
        });
    }
};

const isNGO = async (req, res, next) => {
    if (req.user.role !== 'ngo') {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. NGO role required.' 
        });
    }
    next();
};

const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Admin role required.' 
        });
    }
    next();
};

module.exports = { auth, isNGO, isAdmin };  