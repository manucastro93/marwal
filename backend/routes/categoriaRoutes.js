const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, categoriaController.crearCategoria);
router.put('/:id', authMiddleware, categoriaController.modificarCategoria);
router.delete('/:id', authMiddleware, categoriaController.eliminarCategoria);
router.get('/', categoriaController.obtenerCategorias);

module.exports = router;