const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Middleware para validar el token JWT
exports.validarToken = (req, res, next) => {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ msg: 'No hay token, permiso no válido' });
  }
  // El header viene como "Bearer <token>", así que lo separamos
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Formato de token no válido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};

// Middleware para validar el rol del usuario
exports.validarRol = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }
    next();
  };
};

// Middleware para limitar la tasa de solicitudes
exports.limitarSolicitudes = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message: 'Demasiadas solicitudes, por favor intenta de nuevo más tarde',
});