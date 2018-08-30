const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator/check');
const indexController = require('../controllers/index');

router.get('/', (req, res, next) => {
  res.render("index");
});

router.get('/signin', indexController.getSignIn);

router.post('/signin', [
  body('username')
      .trim().not().isEmpty().withMessage('Username field can not be empty!'),
  body('password')
      .trim().not().isEmpty().withMessage('Password field can not be empty!'),
], (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let messages = errors.array();
    messages.forEach(function (message) {
      message['message'] = message['msg'];
      delete message['msg'];
      message.type = 'danger';
    });
    return res.render('signin', {messages: messages, username: req.body.username});
  }
  next();
}, indexController.postSignIn);

router.get('/signout', indexController.getSignOut);

router.post('/signout', indexController.postSignOut);

module.exports = router;
