var express = require('express');
var router = express.Router();
const galleries = require('../controllers/galleries.controller');

router.get('/', galleries.findAll);
router.get('/find', galleries.find);

router.get('/:id', galleries.findById);

module.exports = router;