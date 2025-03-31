const express = require('express');
const router = express.Router();
const paginaController = require('../controllers/paginaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/banners', paginaController.obtenerBanners);
router.post('/banners', authMiddleware, paginaController.crearBanner);
router.put('/banners/:id', authMiddleware, paginaController.modificarBanner);
router.delete('/banners/:id', authMiddleware, paginaController.eliminarBanner);

module.exports = router;