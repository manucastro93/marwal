/* @jsxImportSource solid-js */
import { Producto } from "../interfaces/Producto";
import { createSignal, Show } from "solid-js";

interface ProductDetailsProps {
  product: Producto;
  onClose: () => void;
}

const ProductDetails = ({ product, onClose }: ProductDetailsProps) => {
  return (
    <div class="modal">
      <div class="modal-content">
        <span class="close" onClick={onClose}>&times;</span>
        <h2>{product.nombre}</h2>
        <p>{product.descripcion}</p>
        <p>Precio: ${product.precio}</p>
        {/* Agrega más detalles del producto aquí */}
      </div>
    </div>
  );
};

export default ProductDetails;