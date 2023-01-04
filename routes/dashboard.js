var express = require('express');
var router = express.Router();
const dasboardcontroller = require('../controllers/dashboard.controller');



router.get('/admin/dashboard',dasboardcontroller.dashboard);  

module.exports = router;

