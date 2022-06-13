var express = require('express');
var router = express.Router();
const banners = require('../controllers/banner.controller')
const upload = require('../config/uploadPhoto.config')

router.get('/', banners.getAll);
router.get('/active', banners.getActive);
router.get('/:id', banners.findById);
router.put('/:id',upload.array('uploads', 10), banners.updateBanner);

module.exports = router;