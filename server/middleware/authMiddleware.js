const jwt = require('jsonwebtoken');
const User = require('../model/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get token
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from DB
      const user = await User.findById(decoded.id).select('-password');
      // req.user.role = decoded.role; // Ensure role is passed to the request object

      // 4. Check user exists
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // 5. Attach user to request
      req.user = user;

      // 6. Attach role (optional)
      if (decoded.role) {
        req.user.role = decoded.role;
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

// ADMIN CHECK
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(401).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, adminOnly };