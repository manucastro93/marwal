import { Component, createSignal } from 'solid-js';
import { showNotification } from '../components/Notification';
import { BASE_URL } from '../config';

const ImageUpload: Component<{ onImagesChange: (images: string[]) => void }> = (props) => {
  const [images, setImages] = createSignal<string[]>([]);

  const handleImageUpload = async (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const formData = new FormData();
          formData.append('image', files[i]);

          const response = await fetch(`${BASE_URL}/images/upload`, {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          if (response.ok) {
            urls.push(data.url);
          } else {
            showNotification(data.message, 'error');
          }
        } catch (error) {
          showNotification('Error al subir la imagen', 'error');
        }
      }
      setImages([...images(), ...urls]);
      props.onImagesChange([...images(), ...urls]);
    }
  };

  const handleRemoveImage = (url: string) => {
    const updatedImages = images().filter(image => image !== url);
    setImages(updatedImages);
    props.onImagesChange(updatedImages);
  };

  return (
    <div class="image-upload">
      <input type="file" multiple onChange={handleImageUpload} />
      <div class="image-preview">
        {images().map((url, index) => (
          <div class="image-container">
            <img src={url} alt={`Imagen ${index + 1}`} />
            <button onClick={() => handleRemoveImage(url)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;