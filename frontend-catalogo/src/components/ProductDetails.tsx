/* @jsxImportSource solid-js */
import { createSignal, For, Show } from "solid-js";
import { Producto } from "../interfaces/Producto";

interface ProductDetailsProps {
  product: Producto;
  onClose: () => void;
}

const ProductDetails = ({ product, onClose }: ProductDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex() + 1) % product.imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex() - 1 + product.imagenes.length) % product.imagenes.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div class="modal">
      <div class="modal-content">
        <span class="close" onClick={onClose}>&times;</span>
        <div class="product-details">
          <div class="product-images">
            <img class="main-image" src={product.imagenes[currentImageIndex()].url} alt={product.nombre} />
            <Show when={product.imagenes.length > 1}>
              <div class="slider-controls">
                <button onClick={prevImage}>&#10094;</button>
                <button onClick={nextImage}>&#10095;</button>
              </div>
              <div class="thumbnails">
                <For each={product.imagenes}>
                  {(imagen, index) => (
                    <img 
                      class={`thumbnail ${currentImageIndex() === index() ? 'active' : ''}`} 
                      src={imagen.url} 
                      alt={`${product.nombre} thumbnail`} 
                      onClick={() => selectImage(index())} 
                    />
                  )}
                </For>
              </div>
            </Show>
          </div>
          <div class="product-info">
            <h2>{product.nombre}</h2>
            <p>{product.descripcion}</p>
            <p class="product-price">Precio: ${product.precio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;