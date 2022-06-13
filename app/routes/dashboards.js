var express = require('express');
var router = express.Router();
const dashboard = require('../controllers/dashboard.controller')
/* GET users listing. */

router.get('/images', dashboard.countImages);
router.get('/video', dashboard.countVideos);
router.get('/audio', dashboard.countAudios);


module.exports = router;