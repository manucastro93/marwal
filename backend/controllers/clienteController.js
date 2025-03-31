const Cliente = require('../models/Cliente');

// Crear cliente
exports.crearCliente = async (req, res) => {
  const { nombre, email, cuit_cuil, ip, vendedor_id } = req.body;

  try {
    const newCliente = await Cliente.create({
      nombre,
      email,
      cuit_cuil,
      ip,
      vendedor_id,
    });

    res.status(201).json(newCliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modificar cliente
exports.modificarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, cuit_cuil, ip, vendedor_id } = req.body;

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await cliente.update({
      nombre,
      email,
      cuit_cuil,
      ip,
      vendedor_id,
    });

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente
exports.eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await cliente.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener clientes con búsqueda opcional
exports.obtenerClientes = async (req, res) => {
  const { nombre, email, cuit_cuil, vendedor_id } = req.query;

  try {
    const where = {};
    if (nombre) where.nombre = nombre;
    if (email) where.email = email;
    if (cuit_cuil) where.cuit_cuil = cuit_cuil;
    if (vendedor_id) where.vendedor_id = vendedor_id;

    const clientes = await Cliente.findAll({ where });

    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};