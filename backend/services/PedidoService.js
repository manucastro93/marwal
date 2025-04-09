// services/pedidoService.js

const { Cliente, Pedido, DetallePedido, Producto } = require('../models');
const { registrarIP } = require('./ipService');
const { crearLog } = require('./logClienteService');
const { enviarEmailPedido } = require('./emailService');

const crearPedidoCompleto = async ({ clienteData, carrito, ip, userAgent }) => {
  // 1. Crear o actualizar cliente
  const [cliente] = await Cliente.upsert(clienteData, { returning: true });

  // 2. Registrar IP del cliente
  await registrarIP(cliente.id, ip);
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  // 3. Crear el pedido
  const pedido = await Pedido.create({
    cliente_id: cliente.id,
    vendedor_id: cliente.vendedor_id || 0,
    estado: 'pendiente',
    total,
  });

  // 4. Crear los detalles del pedido
  const detalles = await Promise.all(
    carrito.map(async (item) => {
      return await DetallePedido.create({
        pedido_id: pedido.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio,
      });
    })
  );

  // 5. Crear log de cliente
  await crearLog({
    cliente_id: cliente.id,
    accion: 'checkout',
    entidad_id: pedido.id,
    tipo_entidad: 'pedido',
    detalles: JSON.stringify(detalles),
    ip,
    user_agent: userAgent,
  });

  // 6. Enviar email
  await enviarEmailPedido({ cliente, pedido, detalles });

  return { cliente, pedido, detalles };
};

module.exports = { crearPedidoCompleto };
