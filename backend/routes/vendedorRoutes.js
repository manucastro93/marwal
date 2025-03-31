const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, vendedorController.agregarVendedor);
router.put('/:id', authMiddleware, vendedorController.modificarVendedor);
router.delete('/:id', authMiddleware, vendedorController.eliminarVendedor);
router.get('/', authMiddleware, vendedorController.obtenerVendedores);

module.exports = router;