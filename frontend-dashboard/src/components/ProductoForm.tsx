import { Component, createSignal, onMount } from 'solid-js';
import { Producto } from '../interfaces/Producto';
import { Categoria } from '../interfaces/Categoria';
import apiService from '../services/apiService';


interface ProductoFormProps {
  initialProducto: Producto;
  onSave: (producto: Producto) => void;
  onClose: () => void;
}

const ProductoForm: Component<ProductoFormProps> = (props) => {
  const [producto, setProducto] = createSignal(props.initialProducto);
  const [categorias, setCategorias] = createSignal<Categoria[]>([]);

  onMount(() => {
    apiService.getCategorias()
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
  });

  const handleInputChange = (field: keyof Producto, value: string | number) => {
    setProducto({ ...producto(), [field]: value });
  };

  const handleSave = () => {
    props.onSave(producto());
  };

  return (
    <div>
      <h2>{props.initialProducto.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      <input type="text" placeholder="Nombre" value={producto().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
      <input type="number" placeholder="Precio" value={producto().precio} onInput={(e) => handleInputChange('precio', parseFloat(e.currentTarget.value))} />
      <select value={producto().categoria_id} onChange={(e) => handleInputChange('categoria_id', e.currentTarget.value)}>
        <option value="">Seleccionar Categoría</option>
        {categorias().map(categoria => (
          <option value={categoria.id}>{categoria.nombre}</option>
        ))}
      </select>
      <textarea placeholder="Descripción" value={producto().descripcion} onInput={(e) => handleInputChange('descripcion', e.currentTarget.value)}></textarea>
      <input type="number" placeholder="Stock" value={producto().stock} onInput={(e) => handleInputChange('stock', parseInt(e.currentTarget.value))} />
      <button onClick={handleSave}>Guardar</button>
      <button onClick={props.onClose}>Cancelar</button>
    </div>
  );
};

export default ProductoForm;