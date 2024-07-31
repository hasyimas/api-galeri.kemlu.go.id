var express = require('express');
var router = express.Router();
const logVisitorLogin = require('../controllers/log-visitor-login.controller')

router.get('/', logVisitorLogin.getAll);
router.get('/paging', logVisitorLogin.getPaging);
router.get('/chart', logVisitorLogin.chart);
router.get('/:id', logVisitorLogin.findById);
router.post('/', logVisitorLogin.create);



module.exports = router;