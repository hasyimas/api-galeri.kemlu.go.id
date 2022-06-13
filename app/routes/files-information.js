var express = require('express');
var router = express.Router();
const files = require('../controllers/files-information.controller')
const uploadInfo = require('../config/uploadInformationFiles.config')

router.post('/', uploadInfo.array('uploads', 10), files.getInfromationFile);

module.exports = router;