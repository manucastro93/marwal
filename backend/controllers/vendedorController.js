const Usuario = require('../models/Usuario');

exports.agregarVendedor = async (req, res) => {
  const { usuario, nombre, email, telefono, contraseña } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const newVendedor = await Usuario.create({
      usuario,
      nombre,
      email,
      telefono,
      contraseña: hashedPassword,
      rol: 'vendedor',
      link: generateLink(),
    });

    res.status(201).json(newVendedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.modificarVendedor = async (req, res) => {
  const { id } = req.params;
  const { usuario, nombre, email, telefono, contraseña } = req.body;

  try {
    const vendedor = await Usuario.findByPk(id);
    if (!vendedor || vendedor.rol !== 'vendedor') {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : vendedor.contraseña;

    await vendedor.update({
      usuario,
      nombre,
      email,
      telefono,
      contraseña: hashedPassword,
    });

    res.status(200).json(vendedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarVendedor = async (req, res) => {
  const { id } = req.params;

  try {
    const vendedor = await Usuario.findByPk(id);
    if (!vendedor || vendedor.rol !== 'vendedor') {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    await vendedor.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerVendedores = async (req, res) => {
  try {
    const vendedores = await Usuario.findAll({ where: { rol: 'vendedor' } });
    res.status(200).json(vendedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};