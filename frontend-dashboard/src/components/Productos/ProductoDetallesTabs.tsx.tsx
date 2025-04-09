import { Component, createSignal } from 'solid-js';
import { Producto } from '../../interfaces/Producto';

interface Props {
  producto: Producto;
}

const ProductoDetallesTabs: Component<Props> = ({ producto }) => {
  const [activeTab, setActiveTab] = createSignal<'detalles' | 'imagenes' | 'ventas'>('detalles');

  return (
    <div class="producto-detalles">
      <div class="tabs">
        <button onClick={() => setActiveTab('detalles')}>Detalles</button>
        <button onClick={() => setActiveTab('imagenes')}>Imágenes</button>
        <button onClick={() => setActiveTab('ventas')}>Ventas</button>
      </div>

      <div class="tab-content">
        {activeTab() === 'detalles' && (
          <div>
            <p><strong>Código:</strong> {producto.codigo}</p>
            <p><strong>Nombre:</strong> {producto.nombre}</p>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
            <p><strong>Precio:</strong> ${producto.precio}</p>
            <p><strong>Stock:</strong> {producto.stock}</p>
            <p><strong>Categoría ID:</strong> {producto.categoria_id}</p>
          </div>
        )}
        {activeTab() === 'imagenes' && (
          <div class="imagenes">
            {producto.imagenes?.length ? (
              producto.imagenes.map(img => (
                <img src={img.url} alt="Producto" width="150" />
              ))
            ) : (
              <p>No hay imágenes disponibles.</p>
            )}
          </div>
        )}
        {activeTab() === 'ventas' && (
          <div>
            <p>(Aquí deberías cargar ventas desde una API y listarlas)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoDetallesTabs;
