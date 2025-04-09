const { LogCliente } = require('../models');

exports.crearLog = async ({ cliente_id, accion, entidad_id, tipo_entidad, detalles, ip, user_agent }) => {
  return await LogCliente.create({
    cliente_id,
    accion,
    entidad_id,
    tipo_entidad,
    detalles,
    ip,
    user_agent
  });
};