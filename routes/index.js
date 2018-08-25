const express = require('express');
const router = express.Router();
const userRouter = require('./user');

router.get('/', (req, res, next) => {
  res.render("index");
});

router.get('/signin', userRouter);
router.post('/signin', userRouter);

module.exports = router;
