var express = require('express');
var router = express.Router();
const usercontoller = require('../controllers/user.controller');
const dasboardcontroller = require('../controllers/dashboard.controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});
// router.post('/login', usercontoller.login);
// router.get('/Dashboard',dasboardcontroller.dashboard);  
module.exports = router;
