import { Component } from "solid-js";

interface ProductSelectorProps {
  onProductChange: (product: string | null) => void;
}

const ProductSelector: Component<ProductSelectorProps> = (props) => {
  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    props.onProductChange(value === "" ? null : value);
  };

  return (
    <select onChange={handleChange}>
      <option value="">Todos los productos</option>
      <option value="Producto1">Producto 1</option>
      <option value="Producto2">Producto 2</option>
      <option value="Producto3">Producto 3</option>
      {/* Agregar más opciones según sea necesario */}
    </select>
  );
};

export default ProductSelector;