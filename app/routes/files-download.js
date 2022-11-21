var express = require('express');
var router = express.Router();
const filesDownload = require('../controllers/files-download.controller')

router.get('/', filesDownload.getAll);
router.get('/paging', filesDownload.getPaging);
router.get('/chart', filesDownload.chart);
router.get('/:id', filesDownload.findById);
router.post('/', filesDownload.create);

module.exports = router;