const { LogCliente } = require('../models');

// Función para crear un nuevo log
exports.crearLog = async (req, res) => {
  const { cliente_id, accion, entidad_id, tipo_entidad, detalles, ip, user_agent } = req.body;

  try {
    const nuevoLog = await LogCliente.create({
      cliente_id,
      accion,
      entidad_id,
      tipo_entidad,
      detalles,
      ip,
      user_agent,
    });

    res.status(201).json(nuevoLog);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear log', error });
  }
};

// Función para buscar logs
exports.buscarLogs = async (req, res) => {
  try {
    const logs = await LogCliente.findAll();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar logs', error });
  }
};