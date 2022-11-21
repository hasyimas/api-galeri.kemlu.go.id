var express = require('express');
var router = express.Router();
const photos = require('../controllers/photo.controller')
const upload = require('../config/uploadPhoto.config')

router.get('/', photos.getAll);
router.get('/paging', photos.getPaging);
router.get('/:id', photos.findById);
router.post('/', upload.array('uploads', 10), photos.create);
router.put('/:id', upload.array('uploads', 10), photos.update);
router.delete('/', photos.delete);
router.post('/createbulk', upload.array('uploads', 10), photos.createBulk);



module.exports = router;