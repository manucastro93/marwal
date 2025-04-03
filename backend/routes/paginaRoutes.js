const express = require('express');
const router = express.Router();
const paginaController = require('../controllers/paginaController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { setLogoDestination, setBannerDestination } = require('../middlewares/setDestination');


router.get('/banners', paginaController.getBanners);
router.post('/banners', setBannerDestination, upload.single('file'), paginaController.createBanner);
router.put('/banners/:id', paginaController.updateBanner);
router.delete('/banners/:id', paginaController.deleteBanner);

router.get('/logo', paginaController.getLogo);
router.post('/logo', setLogoDestination, upload.single('file'), paginaController.createOrUpdateLogo);

module.exports = router;
