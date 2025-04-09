import { createResource } from 'solid-js';
import { pedidoService } from '../services/pedidoService';
import type { Pedido } from '../interfaces/Pedido';

const MisPedidos = () => {
  const [pedidos] = createResource<Pedido[]>(pedidoService.getPedidosCliente);

  return (
    <div>
      <h2>Mis Pedidos</h2>
      {pedidos.loading && <p>Cargando pedidos...</p>}
      {pedidos.error && <p>Error al cargar pedidos</p>}
      <ul>
        {pedidos()?.map((pedido) => (
          <li>
            <p><strong>Pedido #{pedido.id}</strong></p>
            <p>Fecha: {new Date(pedido.createdAt).toLocaleDateString()}</p>
            <p>Estado: {pedido.estado}</p>
            <ul>
              {pedido.detalles.map((detalle) => (
                <li>
                  Producto: {detalle.producto?.nombre ?? 'Producto'}
                  — Cantidad: {detalle.cantidad}
                  — Precio: ${detalle.precio}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MisPedidos;
