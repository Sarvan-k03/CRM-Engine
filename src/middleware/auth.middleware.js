const jwt = require('jsonwebtoken');
const User = require('../models/User.models');

/**
 * @desc   Verify JWT and protect routes
 * @access Middleware
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Reject if no token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route' 
    });
  }

  try {
    // 3. Verify token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request object (exclude password hash)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User belonging to this token no longer exists' 
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed or expired' 
    });
  }
};

/**
 * @desc   Role-Based Access Control (RBAC)
 * @access Middleware (must be called after `protect`)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};