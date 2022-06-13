var express = require('express');
var router = express.Router();
const videos = require('../controllers/video.controller')
const upload = require('../config/uploadVideo.config')
/* GET users listing. */


router.get('/', videos.getAll);
router.get('/:id', videos.findById);
router.post('/', upload.array('uploads', 10), videos.create);
router.put('/:id', upload.array('uploads', 10), videos.update);
router.delete('/', videos.delete);


module.exports = router;