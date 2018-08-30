const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator/check');
const userController = require('../controllers/user');

router.get('/:username', userController.getUser);

router.post('/:username', [
  body('oldPassword')
      .trim().not().isEmpty().withMessage('Old password field can not be empty!'),
  body('newPassword')
      .trim().not().isEmpty().withMessage('New password field can not be empty!'),
  body('confirmNewPassword')
      .trim().not().isEmpty().withMessage('Confirm new password field can not be empty!'),
], (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let messages = errors.array();
    messages.forEach(function (message) {
      message['message'] = message['msg'];
      delete message['msg'];
      message.type = 'danger';
    });
    return res.render('user', {messages: errors.array()});
  }
  next();
}, userController.postUser);

module.exports = router;
