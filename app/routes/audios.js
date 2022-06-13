var express = require('express');
var router = express.Router();
const audios = require('../controllers/audio.controller')
const upload = require('../config/uploadAudio.config')
/* GET users listing. */


router.get('/', audios.getAll);
router.get('/:id', audios.findById);
router.post('/', upload.array('uploads', 10), audios.create);
router.put('/:id', upload.array('uploads', 10), audios.update);
router.delete('/', audios.delete);


module.exports = router;