const { IP } = require('../models');

exports.registrarIP = async (cliente_id, ip) => {
  return await IP.create({ cliente_id, ip });
};
