var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', userController.login);

module.exports = router;
