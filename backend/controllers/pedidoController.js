const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');

exports.crearPedido = async (req, res) => {
  const { cliente_id, vendedor_id, detalles } = req.body;

  try {
    const newPedido = await Pedido.create({
      cliente_id,
      vendedor_id,
    });

    const detallesData = detalles.map(detalle => ({
      pedido_id: newPedido.id,
      producto_id: detalle.producto_id,
      cantidad: detalle.cantidad,
      precio: detalle.precio,
    }));
    await DetallePedido.bulkCreate(detallesData);

    res.status(201).json(newPedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.modificarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    await pedido.update({ estado });
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPedidos = async (req, res) => {
  const { vendedor_id, cliente_id, estado } = req.query;

  try {
    const where = {};
    if (vendedor_id) where.vendedor_id = vendedor_id;
    if (cliente_id) where.cliente_id = cliente_id;
    if (estado) where.estado = estado;

    const pedidos = await Pedido.findAll({
      where,
      include: [
        { model: DetallePedido, include: [Producto] },
        { model: Cliente },
      ],
    });

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};