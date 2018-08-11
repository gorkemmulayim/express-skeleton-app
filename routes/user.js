var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/signin', userController.getSignIn);
router.post('/signin', userController.postSignIn);

module.exports = router;
