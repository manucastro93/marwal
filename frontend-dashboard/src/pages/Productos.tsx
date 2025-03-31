import { Component, createSignal, onMount } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Producto } from '../interfaces/Producto';
import { apiService } from '../services/apiService';

const Productos: Component = () => {
  const [productos, setProductos] = createSignal<Producto[]>([]);
  const [editProducto, setEditProducto] = createSignal<Producto | null>(null);
  const [newProducto, setNewProducto] = createSignal<Producto>({ id: 0, nombre: '', precio: 0 });

  onMount(() => {
    apiService.getProductos()
      .then(response => setProductos(response.data))
      .catch(error => {
        console.error('Error al obtener los productos:', error);
        showNotification('Error al obtener los productos', 'error');
      });
  });

  const handleInputChange = (field: keyof Producto, value: string | number) => {
    setNewProducto({ ...newProducto(), [field]: value });
  };

  const handleEditChange = (field: keyof Producto, value: string | number) => {
    if (editProducto()) {
      setEditProducto({ ...editProducto()!, [field]: value });
    }
  };

  const handleSaveNew = () => {
    apiService.createProducto(newProducto())
      .then(response => {
        setProductos([...productos(), response.data]);
        showNotification('Producto creado con éxito', 'success');
        setNewProducto({ id: 0, nombre: '', precio: 0 });
      })
      .catch(error => {
        console.error('Error al crear el producto:', error);
        showNotification('Error al crear el producto', 'error');
      });
  };

  const handleSaveEdit = () => {
    if (editProducto()) {
      apiService.updateProducto(editProducto()!.id, editProducto()!)
        .then(response => {
          const updatedProductos = productos().map(p => p.id === response.data.id ? response.data : p);
          setProductos(updatedProductos);
          showNotification('Producto actualizado con éxito', 'success');
          setEditProducto(null);
        })
        .catch(error => {
          console.error('Error al actualizar el producto:', error);
          showNotification('Error al actualizar el producto', 'error');
        });
    }
  };

  return (
    <div>
      <h1>Productos</h1>
      <div>
        <h2>Nuevo Producto</h2>
        <input type="text" placeholder="Nombre" value={newProducto().nombre} onInput={(e) => handleInputChange('nombre', e.currentTarget.value)} />
        <input type="number" placeholder="Precio" value={newProducto().precio} onInput={(e) => handleInputChange('precio', parseFloat(e.currentTarget.value))} />
        <button onClick={handleSaveNew}>Guardar</button>
      </div>
      <ul>
        {productos().map(producto => (
          <li>
            {editProducto() && editProducto()!.id === producto.id ? (
              <div>
                <input type="text" value={editProducto()!.nombre} onInput={(e) => handleEditChange('nombre', e.currentTarget.value)} />
                <input type="number" value={editProducto()!.precio} onInput={(e) => handleEditChange('precio', parseFloat(e.currentTarget.value))} />
                <button onClick={handleSaveEdit}>Actualizar</button>
              </div>
            ) : (
              <div>
                {producto.nombre} - {producto.precio}
                <button onClick={() => setEditProducto(producto)}>Editar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;