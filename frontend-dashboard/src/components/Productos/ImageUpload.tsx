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
  const [previewImages, setPreviewImages] = createSignal<string[]>([]);
  const [uploading, setUploading] = createSignal(false);

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type)) {
      showNotification(`El archivo ${file.name} no es un formato válido. (Solo .jpg y .png)`, 'error');
      return false;
    }
    if (file.size > maxSize) {
      showNotification(`El archivo ${file.name} excede el tamaño máximo de 5MB.`, 'error');
      return false;
    }
    return true;
  };

  const handleFileSelection = (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const validFiles = [];
      const previews = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (validateFile(file)) {
          validFiles.push(file);
          previews.push(URL.createObjectURL(file)); // Genera URL para vista previa
        }
      }
      setPreviewImages(previews);
      uploadImages(validFiles);
    }
  };

  const uploadImages = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('imagenes', file)); // Mismo nombre que en el backend

    try {
      const response = await imagenProductoService.subirImagen(formData); // Ajustar al endpoint múltiple
      const nuevasImagenes = response;
      setImages([...images(), ...nuevasImagenes]);
      props.onImagesChange([...images(), ...nuevasImagenes]);
      showNotification('Imágenes subidas exitosamente.', 'success');
    } catch (error) {
      showNotification('Error al subir las imágenes.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePreview = (index: number) => {
    const updatedPreviews = previewImages().filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
  };

  const handleRemoveImage = async (id: number) => {
    try {
      await imagenProductoService.eliminarImagen(id);
      const updatedImages = images().filter((image) => image.id !== id);
      setImages(updatedImages);
      props.onImagesChange(updatedImages);
      showNotification('Imagen eliminada exitosamente.', 'success');
    } catch (error) {
      showNotification('Error al eliminar la imagen.', 'error');
    }
  };

  return (
    <div class="image-upload">
      <input type="file" name="imagenes" multiple onChange={handleFileSelection} />
      <div class="preview-container">
        {previewImages().map((preview, index) => (
          <div class="preview-item" key={index}>
            <img src={preview} alt={`Preview ${index + 1}`} />
            <button onClick={() => handleRemovePreview(index)}>Eliminar</button>
          </div>
        ))}
      </div>
      {uploading() && <div class="uploading-spinner">Subiendo imágenes...</div>}
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