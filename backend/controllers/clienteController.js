const { Cliente, Pedido, Usuario } = require('../models');
const { validationResult } = require('express-validator');


// Crear o actualizar cliente
exports.crearOActualizarCliente = async (req, res) => {
  const { nombre, email, telefono, cuit_cuil, direccion, localidad, provincia, ip, vendedor_id } = req.body;

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
        direccion,
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
        direccion,
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

// Función para editar un cliente existente
exports.editarCliente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { id } = req.params;
  const { nombre, email, telefono, direccion, localidad, provincia, ip, vendedor_id, estado, usuario_id } = req.body;

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    cliente.nombre = nombre || cliente.nombre;
    cliente.email = email || cliente.email;
    cliente.telefono = telefono || cliente.telefono;
    cliente.direccion = direccion || cliente.direccion;
    cliente.localidad = localidad || cliente.localidad;
    cliente.provincia = provincia || cliente.provincia;
    cliente.ip = ip || cliente.ip;
    cliente.vendedor_id = vendedor_id || cliente.vendedor_id;
    cliente.estado = estado || cliente.estado;
    cliente.usuario_id = usuario_id || cliente.usuario_id;

    await cliente.save();
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar cliente', error });
  }
};

// Función para buscar todos los clientes (limitado por vendedor_id para vendedores)
exports.buscarClientes = async (req, res) => {
  try {
    const clientes = req.usuario.rol === 'vendedor'
      ? await Cliente.findAll({ where: { vendedor_id: req.usuario.id } })
      : await Cliente.findAll();

    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar clientes', error });
  }
};

// Función para buscar todos los clientes desde el catalogo
exports.buscarClientesCatalogo = async (req, res) => {
  try {
      await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar clientes', error });
  }
};

// Función para buscar un cliente por su IP
exports.buscarClientePorIp = async (req, res) => {
  const { ip } = req.params;

  try {
      await Cliente.findOne({ where: { ip } });
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar cliente por IP', error });
  }
};

// Función para buscar un cliente por su ID (limitado por vendedor_id para vendedores)
exports.buscarClientePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = req.usuario.rol === 'vendedor'
      ? await Cliente.findOne({ where: { id, vendedor_id: req.usuario.id } })
      : await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar cliente por ID', error });
  }
};

// Función para buscar las métricas de ventas por cliente
exports.buscarMetricasClientes = async (req, res) => {
  try {
    const metricas = await Pedido.findAll({
      attributes: ['cliente_id', [sequelize.fn('SUM', sequelize.col('total')), 'total_ventas']],
      group: ['cliente_id'],
    });

    res.status(200).json(metricas);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar métricas de clientes', error });
  }
};