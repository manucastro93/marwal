const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');

// Crear un pedido sin los detalles
exports.crearPedido = async (req, res) => {
  const { cliente_id, vendedor_id } = req.body;

  try {
    if (!cliente_id || !vendedor_id) {
      return res.status(400).json({ error: 'Cliente ID y Vendedor ID son requeridos' });
    }

    // Crear el pedido
    const newPedido = await Pedido.create({
      cliente_id,
      vendedor_id,
    });

    res.status(201).json(newPedido);
  } catch (error) {
    console.error("Error creating pedido:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Agregar detalles a un pedido existente
exports.agregarDetallesPedido = async (req, res) => {
  const { pedidoId } = req.params;
  const detalles = req.body;

  try {
    // Verificar si el pedido existe
    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que detalles esté definido y sea un array
    if (!Array.isArray(detalles)) {
      return res.status(400).json({ error: 'Detalles debe ser un array' });
    }

    // Agregar pedido_id a cada detalle
    const detallesConPedidoId = detalles.map(detalle => ({
      ...detalle,
      pedido_id: pedidoId
    }));

    // Crear los detalles del pedido
    await DetallePedido.bulkCreate(detallesConPedidoId);

    res.status(201).json({ message: 'Detalles agregados correctamente' });
  } catch (error) {
    console.error("Error adding detalles del pedido:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Modificar el estado de un pedido
exports.modificarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedido.estado = estado;
    await pedido.save();

    res.status(200).json(pedido);
  } catch (error) {
    console.error("Error updating pedido:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener todos los pedidos
exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error("Error fetching pedidos:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};