const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // FIX: The payload structure is { user: { id, role } }
    // We must assign decoded.user to req.user
    req.user = decoded.user; 
    
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Debugging: Print what the server sees to the console
    console.log("Checking Role for User:", req.user); 

    if (!req.user || !roles.includes(req.user.role)) {
      console.log(`Access Denied. User Role: ${req.user?.role}, Required: ${roles}`);
      return res.status(403).json({ msg: 'User role not authorized' });
    }
    next();
  };
};

module.exports = { protect, authorize };