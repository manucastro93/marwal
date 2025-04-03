const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', vendedorController.agregarVendedor);
router.put('/:id', vendedorController.modificarVendedor);
router.put('/:id/eliminar', vendedorController.eliminarVendedor);
router.get('/', vendedorController.obtenerVendedores);
router.get('/by-link/:link', vendedorController.obtenerVendedorPorLink);

module.exports = router;