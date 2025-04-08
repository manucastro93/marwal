const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar archivos a 5MB
});

module.exports = {
  singleUpload: upload.single('imagen'),
  multipleUpload: upload.array('imagenes', 10), // Hasta 10 imágenes
};