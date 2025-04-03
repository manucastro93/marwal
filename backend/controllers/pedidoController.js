const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');

exports.crearPedidoConDetalles = async (req, res) => {
  const { cliente_id, vendedor_id, detalles } = req.body;

  try {
    if (!cliente_id || !vendedor_id) {
      return res.status(400).json({ error: 'Cliente ID y Vendedor ID son requeridos' });
    }

    // Crear el pedido
    const newPedido = await Pedido.create({
      cliente_id,
      vendedor_id,
    });

    // Agregar pedido_id a cada detalle
    const detallesConPedidoId = detalles.map(detalle => ({
      ...detalle,
      pedido_id: newPedido.id
    }));

    // Crear los detalles del pedido
    await DetallePedido.bulkCreate(detallesConPedidoId);

    res.status(201).json(newPedido);
  } catch (error) {
    console.error("Error creating pedido or detalles:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};