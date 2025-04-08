import { Component, createSignal, onMount, createEffect } from 'solid-js';
import { Producto } from '../../interfaces/Producto';
import { Categoria } from '../../interfaces/Categoria';
import { categoriaService } from '../../services/categoriaService';
import ImageUpload from './ImageUpload';

interface ProductoFormProps {
  initialProducto: Producto;
  onSave: (producto: Producto) => void;
  onClose: () => void;
}

const ProductoForm: Component<ProductoFormProps> = (props) => {
  const [producto, setProducto] = createSignal(props.initialProducto);
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [activeTab, setActiveTab] = createSignal<string>('details'); // Nueva señal para la pestaña activa

  onMount(() => {
    categoriaService.obtenerCategorias()
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        setError('Error al obtener las categorías');
      });
  });

  createEffect(() => {
    setProducto(props.initialProducto);
  });

  const handleInputChange = (field: keyof Producto, value: string | number) => {
    setProducto({ ...producto(), [field]: value });
  };

  const handleImageChange = (images: Imagen[]) => {
    setProducto({ ...producto(), imagenes: images });
  };

  const handleSave = async () => {
    const currentProducto = producto();
    if (!currentProducto.codigo || !currentProducto.nombre || !currentProducto.precio || !currentProducto.categoria_id) {
      setError("Hay campos vacíos que son obligatorios. (Código, Nombre, Precio y Categoría)");
      return;
    }
    try {
      await props.onSave(producto());
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Error al guardar el producto');
    }
  };

  return (
    <div>
      <h2>{props.initialProducto.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      {error() && <div class="error-message">{error()}</div>}
      
      <div class="tabs">
        <button class={activeTab() === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Detalles</button>
        <button class={activeTab() === 'images' ? 'active' : ''} onClick={() => setActiveTab('images')}>Imágenes</button>
      </div>

      {activeTab() === 'details' && (
        <div class="tab-content">
          <input type="text" placeholder="Codigo" value={producto().codigo} onInput={(e) => handleInputChange('codigo', e.currentTarget.value)} />
          <input type="text" placeholder="Nombre" value={producto().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
          <textarea placeholder="Descripción" value={producto().descripcion} onInput={(e) => handleInputChange('descripcion', e.currentTarget.value)}></textarea>
          <input type="number" placeholder="Precio" value={producto().precio} onInput={(e) => handleInputChange('precio', isNaN(parseFloat(e.currentTarget.value)) ? 0 : parseFloat(e.currentTarget.value))} />
          <select value={producto().categoria_id} onChange={(e) => handleInputChange('categoria_id', parseInt(e.currentTarget.value))}>
            <option value="">Seleccionar Categoría</option>
            {categorias().map(categoria => (
              <option value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
          <input type="number" placeholder="Stock" value={producto().stock} onInput={(e) => handleInputChange('stock', isNaN(parseInt(e.currentTarget.value)) ? 0 : parseInt(e.currentTarget.value))} />
        </div>
      )}

      {activeTab() === 'images' && (
        <div class="tab-content">
          <ImageUpload onImagesChange={handleImageChange} initialImages={producto().imagenes || []} />
        </div>
      )}

      <button style={{ 'background-color': 'green', color: 'white' }} onClick={handleSave}>Guardar</button>
      <button style={{ float: 'right' }} onClick={props.onClose}>Cancelar</button>
    </div>
  );
};

export default ProductoForm;