import { Component, createSignal } from 'solid-js';
import { showNotification } from '../components/Notification';
import { Imagen } from '../interfaces/Producto';
import apiService from '../services/apiService';
import { BASE_URL } from '../config';

interface ImageUploadProps {
  onImagesChange: (images: Imagen[]) => void;
  initialImages: Imagen[];
  productoId: number; // Agregar propiedad productoId
}

const ImageUpload: Component<ImageUploadProps> = (props) => {
  const [images, setImages] = createSignal<Imagen[]>(props.initialImages || []);
  //const BASE_URL = 'http://localhost:3000';

  const handleImageUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const newImages: Imagen[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await apiService.uploadImage(files[i]);
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
            <img src={`${BASE_URL}${image.url}`} alt={`Imagen ${index + 1}`} />
            <button onClick={() => handleRemoveImage(image.url)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;