var express = require('express');
var router = express.Router();
var userRouter = require('./user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', userRouter);
router.post('/signin', userRouter);

module.exports = router;
