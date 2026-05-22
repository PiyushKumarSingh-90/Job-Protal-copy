// Import required packages
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    // Remove 'Bearer ' from token string
    const actualToken = token.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // Find user by ID and add to request
    const user = await User.findById(decoded.userId).select('-password');
    req.user = user;
    
    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Export the authentication middleware
module.exports = auth;
