var express = require('express');
var router = express.Router();
var userRouter = require('./user');

router.get('/', (req, res, next) => {
  res.send("Ok");
});

router.get('/signin', userRouter);
router.post('/signin', userRouter);

module.exports = router;
