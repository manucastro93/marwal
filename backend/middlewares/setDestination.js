const path = require('path');

const setLogoDestination = (req, res, next) => {
  req.destination = path.join(__dirname, '../uploads/imagenes/pagina/logo');
  next();
};

const setBannerDestination = (req, res, next) => {
  req.destination = path.join(__dirname, '../uploads/imagenes/pagina/banners');
  next();
};

module.exports = { setLogoDestination, setBannerDestination };