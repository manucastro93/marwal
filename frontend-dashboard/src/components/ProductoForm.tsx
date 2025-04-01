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
  const [imagenes, setImagenes] = createSignal<string[]>([]);

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

  const handleImageUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await apiService.uploadImage(files[i]);
        urls.push(url);
      }
      setImagenes([...imagenes(), ...urls]);
      setProducto({ ...producto(), imagenes: [...imagenes(), ...urls] });
    }
  };

  const handleSave = () => {
    // Ensure all required fields are properly formatted
    const currentProducto = producto();
    if (!currentProducto.nombre || !currentProducto.precio || !currentProducto.categoria_id) {
      console.error("Todos los campos obligatorios deben ser completados");
      return;
    }
    
    props.onSave(producto());
  };

  return (
    <div>
      <h2>{props.initialProducto.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      <input type="text" placeholder="Código" value={producto().codigo} onInput={(e) => handleInputChange('codigo', e.currentTarget.value)} />
      <input type="text" placeholder="Nombre" value={producto().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
      <input type="number" placeholder="Precio" value={producto().precio} onInput={(e) => handleInputChange('precio', isNaN(parseFloat(e.currentTarget.value)) ? 0 : parseFloat(e.currentTarget.value))} />
      <select value={producto().categoria_id} onChange={(e) => handleInputChange('categoria_id', parseInt(e.currentTarget.value))}>
        <option value="">Seleccionar Categoría</option>
        {categorias().map(categoria => (
          <option value={categoria.id}>{categoria.nombre}</option>
        ))}
      </select>
      <textarea placeholder="Descripción" value={producto().descripcion} onInput={(e) => handleInputChange('descripcion', e.currentTarget.value)}></textarea>
      <input type="number" placeholder="Stock" value={producto().stock} onInput={(e) => handleInputChange('stock', isNaN(parseInt(e.currentTarget.value)) ? 0 : parseInt(e.currentTarget.value))} />
      <input type="file" multiple onChange={handleImageUpload} />
      <div>
        {imagenes().map((url, index) => (
          <img src={url} alt={`Imagen ${index + 1}`} width="100" />
        ))}
      </div>
      <button onClick={handleSave}>Guardar</button>
      <button onClick={props.onClose}>Cancelar</button>
    </div>
  );
};

export default ProductoForm;