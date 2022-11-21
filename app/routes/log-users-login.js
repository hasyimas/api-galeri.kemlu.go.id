var express = require('express');
var router = express.Router();
const logUsersLogin = require('../controllers/log-users-login.controller')

router.get('/', logUsersLogin.getAll);
router.get('/paging', logUsersLogin.getPaging);
router.get('/:id', logUsersLogin.findById);
router.post('/', logUsersLogin.create);



module.exports = router;