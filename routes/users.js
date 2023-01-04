var express = require('express');
var router = express.Router();
const usercontoller = require('../controllers/user.controller');


router.post('/admin/login', usercontoller.login);

module.exports = router;
