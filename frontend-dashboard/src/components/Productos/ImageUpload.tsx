import { Component, createSignal } from 'solid-js';
import { showNotification } from '../Layout/Notification';
import { Imagen } from '../../interfaces/Producto';
import { imagenProductoService } from '../../services/imagenProductoService';

interface ImageUploadProps {
  onImagesChange: (images: Imagen[]) => void;
  initialImages: Imagen[];
  productoId: number; // Agregar propiedad productoId
}

const ImageUpload: Component<ImageUploadProps> = (props) => {
  const [images, setImages] = createSignal<Imagen[]>(props.initialImages || []);

  const handleImageUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const newImages: Imagen[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await imagenProductoService.subirImagen(files[i]);
          newImages.push({
            id: 0, // Asegúrate de manejar correctamente el ID en el backend
            producto_id: props.productoId,
            url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          showNotification('Error al subir la imagen', 'error');
        }
      }
      const updatedImages = [...images(), ...newImages];
      setImages(updatedImages);
      props.onImagesChange(updatedImages);
    }
  };

  const handleRemoveImage = (url: string) => {
    const updatedImages = images().filter(image => image.url !== url);
    setImages(updatedImages);
    props.onImagesChange(updatedImages);
  };

  return (
    <div class="image-upload">
      <input type="file" multiple onChange={handleImageUpload} />
      <div class="image-preview">
        {images().map((image, index) => (
          <div class="image-container">
            <img src={`${image.url}`} alt={`Imagen ${index + 1}`} />
            <button onClick={() => handleRemoveImage(image.url)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;