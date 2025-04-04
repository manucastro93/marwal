const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const { rol } = req.user;
  
      if (!roles.includes(rol)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;