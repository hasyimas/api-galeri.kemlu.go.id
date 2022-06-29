var express = require('express');
var router = express.Router();
const users = require('../controllers/users.controller')

router.get('/', users.getAll);
router.get('/:id', users.findById);
router.post('/', users.create);
router.put('/:id',users.update);
router.delete('/', users.delete);

module.exports = router;