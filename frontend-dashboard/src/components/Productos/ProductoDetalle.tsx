import { Component, createSignal } from 'solid-js';
import { Producto } from '../../interfaces/Producto';
import { Categoria } from '../../interfaces/Categoria';

interface Props {
  producto: Producto;
  categorias: Categoria[];
  onClose: () => void;
}

const ProductoDetalle: Component<Props> = (props) => {
  const [activeTab, setActiveTab] = createSignal<'info' | 'imagenes'>('info');

  const getCategoriaNombre = (categoria_id: number) => {
    const categoria = props.categorias.find(c => c.id === categoria_id);
    return categoria ? categoria.nombre : 'Desconocida';
  };

  return (
    <div class="producto-detalle">
      <h2>Detalle del Producto</h2>
      <div class="tabs">
        <button onClick={() => setActiveTab('info')} class={activeTab() === 'info' ? 'active' : ''}>Información</button>
        <button onClick={() => setActiveTab('imagenes')} class={activeTab() === 'imagenes' ? 'active' : ''}>Imágenes</button>
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
        <div class="tab-content">
          {props.producto.imagenes && props.producto.imagenes.length > 0 ? (
            props.producto.imagenes.map((img) => (
              <img src={img.url} alt="Producto" width="120" style={{ margin: '10px' }} />
            ))
          ) : (
            <p>Sin imágenes.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductoDetalle;
