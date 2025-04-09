
const { IP } = require('../models');

exports.registrarIP = async (cliente_id, ip) => {
  const yaExiste = await IP.findOne({ where: { cliente_id, ip } });

  if (!yaExiste) {
    return await IP.create({ cliente_id, ip });
  }

  return yaExiste; // o simplemente no hacer nada
};
