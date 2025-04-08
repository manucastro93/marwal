import { Component, createSignal } from 'solid-js';
import { showNotification } from '../Layout/Notification';
import { Imagen } from '../../interfaces/Producto';
import { imagenProductoService } from '../../services/imagenProductoService';

interface ImageUploadProps {
  onImagesChange: (images: Imagen[]) => void;
  initialImages: Imagen[];
}

const ImageUpload: Component<ImageUploadProps> = (props) => {
  const [images, setImages] = createSignal<Imagen[]>(props.initialImages || []);

  const handleImageUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('imagenes', files[i]);
      }
  
      try {
        const response = await imagenProductoService.subirImagen(formData);
        const nuevasImagenes = response;
        setImages([...images(), ...nuevasImagenes]);
        props.onImagesChange([...images(), ...nuevasImagenes]);
      } catch (error) {
        showNotification('Error al subir las imágenes', 'error');
      }
    }
  };

  const handleRemoveImage = async (id: number) => {
    try {
      await imagenProductoService.eliminarImagen(id);
      const updatedImages = images().filter(image => image.id !== id);
      setImages(updatedImages);
      props.onImagesChange(updatedImages);
    } catch (error) {
      showNotification('Error al eliminar la imagen', 'error');
    }
  };

  return (
    <div class="image-upload">
      <input type="file" multiple onChange={handleImageUpload} />
      <div class="image-preview">
        {images().map((image, index) => (
          <div class="image-container" key={index}>
            <img src={image.url} alt={`Imagen ${index + 1}`} />
            <button onClick={() => handleRemoveImage(image.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;