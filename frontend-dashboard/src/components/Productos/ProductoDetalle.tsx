import { Component, createSignal, onMount } from 'solid-js';
import { Producto } from '../../interfaces/Producto';
import { Categoria } from '../../interfaces/Categoria';

interface Props {
  producto: Producto;
  categorias: Categoria[];
  onClose: () => void;
}

const ProductoDetalle: Component<Props> = (props) => {
  const [activeTab, setActiveTab] = createSignal<'info' | 'imagenes' | 'ventas'>('info');
  const [ventas, setVentas] = createSignal<number>(0); // Cantidad total de ventas

  onMount(async () => {
    // Simulación: reemplazar con llamada real a API cuando esté disponible
    const simulatedVentas = Math.floor(Math.random() * 100);
    setVentas(simulatedVentas);
  });

  const getCategoriaNombre = (categoria_id: number) => {
    const categoria = props.categorias.find(c => c.id === categoria_id);
    return categoria ? categoria.nombre : 'Desconocida';
  };

  return (
    <div class="producto-detalle p-4">
      <h2>Detalle del Producto</h2>
      <div class="tabs mb-3 d-flex gap-2">
        <button class={`btn btn-outline-primary ${activeTab() === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Información</button>
        <button class={`btn btn-outline-primary ${activeTab() === 'imagenes' ? 'active' : ''}`} onClick={() => setActiveTab('imagenes')}>Imágenes</button>
        <button class={`btn btn-outline-primary ${activeTab() === 'ventas' ? 'active' : ''}`} onClick={() => setActiveTab('ventas')}>Ventas</button>
      </div>

      {activeTab() === 'info' && (
        <div class="tab-content">
          <p><strong>Código:</strong> {props.producto.codigo}</p>
          <p><strong>Nombre:</strong> {props.producto.nombre}</p>
          <p><strong>Descripción:</strong> {props.producto.descripcion}</p>
          <p><strong>Precio:</strong> ${props.producto.precio}</p>
          <p><strong>Stock:</strong> {props.producto.stock}</p>
          <p><strong>Categoría:</strong> {getCategoriaNombre(props.producto.categoria_id)}</p>
        </div>
      )}

      {activeTab() === 'imagenes' && (
        <div class="tab-content d-flex flex-wrap gap-3">
          {props.producto.imagenes && props.producto.imagenes.length > 0 ? (
            props.producto.imagenes.map((img) => (
              <img src={img.url} alt="Producto" width="120" style={{ margin: '10px' }} />
            ))
          ) : (
            <p>Sin imágenes.</p>
          )}
        </div>
      )}

      {activeTab() === 'ventas' && (
        <div class="tab-content">
          <p><strong>Total de Ventas:</strong> {ventas()}</p>
          <p>(Aquí podés agregar una tabla de pedidos relacionados en el futuro)</p>
        </div>
      )}
    </div>
  );
};

export default ProductoDetalle;
