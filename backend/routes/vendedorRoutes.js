const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, vendedorController.agregarVendedor);
router.put('/:id', vendedorController.modificarVendedor);
router.delete('/:id', vendedorController.eliminarVendedor);
router.get('/', vendedorController.obtenerVendedores);

module.exports = router;