const { Cliente, Pedido } = require('../models');
const { validationResult } = require('express-validator');

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

// Función para buscar un cliente por su IP
exports.buscarClientePorIp = async (req, res) => {
  const { ip } = req.params;

  try {
    const cliente = req.usuario.rol === 'vendedor'
      ? await Cliente.findOne({ where: { ip, vendedor_id: req.usuario.id } })
      : await Cliente.findOne({ where: { ip } });

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