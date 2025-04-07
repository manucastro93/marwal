// Middleware para el manejo centralizado de errores
exports.manejarErrores = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Ocurrió un error en el servidor', error: err.message });
  };