var express = require('express');
var router = express.Router();
const verifyToken = require("../middleware/auth")
const auth = require('../controllers/auth.controllers')

router.get('/verifytoken', verifyToken);
router.post('/', auth.login);
router.post('/logout', auth.logout);

module.exports = router;
