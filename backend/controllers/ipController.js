const { Ip } = require('../models');

exports.registrarIp = async (req, res) => {
  const { cliente_id, ip } = req.body;

  try {
    // Verificar si ya existe esa IP para ese cliente
    const existe = await Ip.findOne({ where: { cliente_id, ip } });

    if (!existe) {
      const nuevaIp = await Ip.create({ cliente_id, ip });
      return res.status(201).json(nuevaIp);
    }

    res.status(200).json({ msg: 'IP ya registrada para ese cliente' });
  } catch (error) {
    console.error("Error registrando IP:", error);
    res.status(500).json({ msg: 'Error registrando IP', error });
  }
};
