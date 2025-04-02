const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');

// Ruta para subir imágenes
router.post('/upload', imagenController.uploadImage);

module.exports = router;