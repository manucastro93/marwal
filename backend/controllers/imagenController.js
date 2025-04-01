const multer = require('multer');
const path = require('path');
const ftp = require('basic-ftp');
const { url } = require('inspector');
require('dotenv').config();

// Configurar Multer para almacenar archivos temporalmente en el servidor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp_uploads/'); // Carpeta temporal
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadImage = async (req, res) => {
  const localPath = path.join(__dirname, '../temp_uploads', req.file.filename);
  console.log('Ruta local:', localPath);
  try {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    const localPath = path.join(__dirname, '../temp_uploads', req.file.filename);
    const remotePath = `public_html/uploads/${req.file.filename}`;

    await client.uploadFrom(localPath, remotePath);

    client.close();

    res.status(200).json({
      message: 'Imagen subida con éxito',
      url: `http://${process.env.FTP_HOST}/${remotePath}`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al subir la imagen',
      error: error.message,
    });
  }
};

module.exports = { upload, uploadImage };