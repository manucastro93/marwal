import { Component, createSignal, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Pedido } from '../../interfaces/Pedido';
import { pedidoService } from '../../services/pedidoService';

interface PedidoDetalleProps {
  pedidoId: string;
}

const PedidoDetalle: Component<PedidoDetalleProps> = (props) => {
  const params = useParams<{ pedidoId: string }>();
  const pedidoId = parseInt(params.pedidoId || props.pedidoId, 10);
  const [pedido, setPedido] = createSignal<Pedido | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  console.log("Inicializando componente PedidoDetalle con ID:", pedidoId);

  onMount(() => {
    console.log("Llamando a la API para obtener el pedido con ID:", pedidoId);
    pedidoService.obtenerPedidoPorId(pedidoId)
      .then(response => {
        console.log("Respuesta de la API:", response);
        setPedido(() => response);
        setLoading(() => false);
      })
      .catch(error => {
        console.error('Error al obtener el pedido:', error);
        setError(() => 'Error al obtener el pedido');
        setLoading(() => false);
      });
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div class="pedido-detalle-container">
      {loading() && <p>Cargando...</p>}
      {error() && <p>{error()}</p>}
      {pedido() && !loading() && (
        <>
          <div class="pedido-detalle-header">
            <h2>Detalles del Pedido</h2>
          </div>
          <table class="pedido-detalle-table">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{pedido()!.id}</td>
              </tr>
              <tr>
                <th>Cliente</th>
                <td>{pedido()!.cliente}</td>
              </tr>
              <tr>
                <th>Vendedor</th>
                <td>{pedido()!.vendedor}</td>
              </tr>
              <tr>
                <th>Estado</th>
                <td>{pedido()!.estado}</td>
              </tr>
              <tr>
                <th>Fecha</th>
                <td>{new Date(pedido()!.createdAt).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
          <h3>Detalles del Pedido:</h3>
          <table class="pedido-detalle-table">
            <thead>
              <tr>
                <th>Producto ID</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {pedido()!.detalles.map((detalle) => (
                <tr>
                  <td>{detalle.producto_id}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button class="print-button" onClick={handlePrint}>Imprimir</button>
        </>
      )}
    </div>
  );
};

export default PedidoDetalle;