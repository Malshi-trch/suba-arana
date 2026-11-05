function requireRole(rolesArray) {
  return function (req, res, next) {
    if (!req.user || !rolesArray.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden. This action requires one of the following roles: ${rolesArray.join(', ')}.` 
      });
    }
    next();
  };
}

module.exports = { requireRole };