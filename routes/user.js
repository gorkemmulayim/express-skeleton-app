const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator/check');
const userController = require('../controllers/user');

router.get('/signin', userController.getSignIn);

router.post('/signin', [
  body('username')
      .not().isEmpty().withMessage('Username can not be empty.'),
  body('password')
      .trim()
      .not().isEmpty().withMessage('Password can not be empty.'),
], (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    res.redirect('signin');
  } else {
    next();
  }
}, userController.postSignIn);

module.exports = router;
