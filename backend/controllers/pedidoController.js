const { Pedido, Cliente, Usuario, Producto, DetallePedido, Categoria } = require('../models');
const pedidoService = require('../services/pedidoService');

exports.crearPedido = async (req, res) => {
  const { cliente, detalles, ip } = req.body;

  if (!cliente.cuit_cuil) {
    return res.status(400).json({ message: 'Falta el CUIT/CUIL del cliente' });
  }

  try {
    const { cliente: clienteDB, pedido, detalles: detallesDB } = await pedidoService.crearPedidoCompleto({
      clienteData: cliente,
      carrito: detalles,
      ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ pedido, detalles: detallesDB });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ msg: 'Error al crear pedido', error });
  }
};

// Función para modificar el estado de un pedido
exports.modificarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }

    pedido.estado = estado;
    await pedido.save();
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ msg: 'Error al modificar estado del pedido', error });
  }
};

// Función para buscar todos los pedidos (limitado por vendedor_id para vendedores)
exports.buscarPedidos = async (req, res) => {
  try {
    const pedidos = req.usuario.rol === 'vendedor'
      ? await Pedido.findAll({ where: { vendedor_id: req.usuario.id } })
      : await Pedido.findAll();

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar pedidos', error });
  }
};

// Función para buscar un pedido por su ID (limitado por vendedor_id para vendedores)
exports.buscarPedidoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = req.usuario.rol === 'vendedor'
      ? await Pedido.findOne({ where: { id, vendedor_id: req.usuario.id } })
      : await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar pedido por ID', error });
  }
};

// Función para buscar pedidos por su estado (limitado por vendedor_id para vendedores)
exports.buscarPedidosPorEstado = async (req, res) => {
  const { estado } = req.params;

  try {
    const pedidos = req.usuario.rol === 'vendedor'
      ? await Pedido.findAll({ where: { estado, vendedor_id: req.usuario.id } })
      : await Pedido.findAll({ where: { estado } });

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar pedidos por estado', error });
  }
};

// Función para buscar el total de pedidos del mes
exports.buscarTotalPedidosMes = async (req, res) => {
  try {
    const totalPedidosMes = await Pedido.count({
      where: sequelize.where(
        sequelize.fn('date_trunc', 'month', sequelize.col('created_at')),
        sequelize.fn('date_trunc', 'month', sequelize.fn('now'))
      ),
    });

    res.status(200).json({ totalPedidosMes });
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar total de pedidos del mes', error });
  }
};

// Función para buscar el total de pedidos del día
exports.buscarTotalPedidosDia = async (req, res) => {
  try {
    const totalPedidosDia = await Pedido.count({
      where: sequelize.where(
        sequelize.fn('date_trunc', 'day', sequelize.col('created_at')),
        sequelize.fn('date_trunc', 'day', sequelize.fn('now'))
      ),
    });

    res.status(200).json({ totalPedidosDia });
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar total de pedidos del día', error });
  }
};

// Función para buscar el total de pedidos del año
exports.buscarTotalPedidosAnual = async (req, res) => {
  try {
    const totalPedidosAnual = await Pedido.count({
      where: sequelize.where(
        sequelize.fn('date_trunc', 'year', sequelize.col('created_at')),
        sequelize.fn('date_trunc', 'year', sequelize.fn('now'))
      ),
    });

    res.status(200).json({ totalPedidosAnual });
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar total de pedidos del año', error });
  }
};

// Función para buscar pedidos en un rango de fechas
exports.buscarPedidosRangoFechas = async (req, res) => {
  const { fechaInicio, fechaFin } = req.body;

  try {
    const pedidos = await Pedido.findAll({
      where: {
        created_at: {
          [sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
        },
      },
    });

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar pedidos en rango de fechas', error });
  }
};

// Función para buscar pedidos por vendedor
exports.buscarPedidosPorVendedor = async (req, res) => {
  const { vendedor_id } = req.params;

  try {
    const pedidos = await Pedido.findAll({ where: { vendedor_id } });

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar pedidos por vendedor', error });
  }
};

// Función para buscar pedidos por producto
exports.buscarPedidosPorProducto = async (req, res) => {
  const { producto_id } = req.params;

  try {
    const pedidos = await Pedido.findAll({
      include: {
        model: DetallePedido,
        where: { producto_id },
      },
    });

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar pedidos por producto', error });
  }
};

// Función para buscar pedidos por categoría
exports.buscarPedidosPorCategoria = async (req, res) => {
  const { categoria_id } = req.params;

  try {
    const pedidos = await Pedido.findAll({
      include: {
        model: DetallePedido,
        include: {
          model: Producto,
          where: { categoria_id },
        },
      },
    });

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar pedidos por categoría', error });
  }
};

exports.obtenerPedidosPorClienteIp = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const ipRegistro = await Ip.findOne({ where: { ip }, include: Cliente });
    if (!ipRegistro || !ipRegistro.Cliente) {
      return res.status(404).json({ msg: 'Cliente no encontrado para esta IP' });
    }

    const pedidos = await Pedido.findAll({
      where: { cliente_id: ipRegistro.Cliente.id },
      include: [
        { model: DetallePedido, include: [Producto] },
        { model: Cliente }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: 'Error obteniendo pedidos del cliente', error });
  }
};
