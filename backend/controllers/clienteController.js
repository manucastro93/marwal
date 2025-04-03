const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

// Crear o actualizar cliente
exports.crearOActualizarCliente = async (req, res) => {
  const { nombre, email, telefono, cuit_cuil, dirección, localidad, provincia, ip, vendedor_id } = req.body;

  if (!nombre || !email || !cuit_cuil) {
    return res.status(400).json({ error: 'Nombre, email y CUIT/CUIL son obligatorios' });
  }

  try {
    // Buscar cliente por CUIT/CUIL
    let cliente = await Cliente.findOne({ where: { cuit_cuil } });

    if (cliente) {
      // Si existe, actualizar el cliente
      cliente = await cliente.update({
        nombre,
        email,
        telefono,
        dirección,
        localidad,
        provincia,
        ip,
        vendedor_id,
      });
      res.status(200).json(cliente);
    } else {
      // Si no existe, crear un nuevo cliente
      cliente = await Cliente.create({
        nombre,
        email,
        telefono,
        cuit_cuil,
        dirección,
        localidad,
        provincia,
        ip,
        vendedor_id,
      });
      res.status(201).json(cliente);
    }
  } catch (error) {
    console.error('Error al crear o actualizar el cliente:', error);
    res.status(500).json({ error: 'Error al crear o actualizar el cliente' });
  }
};

// Buscar cliente por IP
exports.obtenerClientePorIp = async (req, res) => {
  const { ip } = req.params;

  try {
    const cliente = await Cliente.findOne({ where: { ip } });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

// Modificar cliente
exports.modificarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, cuit_cuil, dirección, localidad, provincia, ip, vendedor_id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID del cliente es obligatorio' });
  }

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const updatedCliente = await cliente.update({
      nombre,
      email,
      telefono,
      cuit_cuil,
      dirección,
      localidad,
      provincia,
      ip,
      vendedor_id,
    });

    res.status(200).json(updatedCliente);
  } catch (error) {
    console.error('Error al modificar el cliente:', error);
    res.status(500).json({ error: 'Error al modificar el cliente' });
  }
};

// Eliminar cliente
exports.eliminarCliente = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID del cliente es obligatorio' });
  }

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await cliente.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
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

    const clientes = await Cliente.findAll({
      where,
      include: {
        model: Usuario,
        as: 'vendedor',
        attributes: ['id', 'nombre', 'email'], // Asegúrate de seleccionar los campos necesarios del vendedor
      },
    });
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

// Obtener cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByPk(id, {
      include: {
        model: Usuario,
        as: 'vendedor',
        attributes: ['id', 'nombre', 'email'], // Asegúrate de seleccionar los campos necesarios del vendedor
      },
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};