import { createSignal, onMount } from 'solid-js';
import { productoService } from '../../services/productoService';
import { Producto } from '../../interfaces/Producto';

const ProductosList = () => {
  const [productos, setProductos] = createSignal<Producto[]>([]);

  onMount(async () => {
    const data = await productoService.obtenerProductos();
    setProductos(data);
  });

  return (
    <div>
      <h1>Lista de Productos</h1>
      <ul>
        {productos().map(producto => (
          <li>{producto.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductosList;