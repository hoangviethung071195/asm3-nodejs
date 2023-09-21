const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
  body('password', 'Please enter a password at least 8 characters.')
    .isLength({ min: 8 })
    .trim(),
], authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value })
        .then(user => {
          if (user) {
            throw Error('E-Mail exists already, please pick a different one.');
          }
        });
    })
    .normalizeEmail(),
  body('password', 'Please enter a password at least 8 characters.')
    .isLength({ min: 8 })
    .trim(),
  // body('confirmPassword')
  //   .trim()
  //   .custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       console.log('req.body.password ', req.body.password);
  //       throw Error('Password have to match.');
  //     }
  //     return true;
  //   })
], authController.postSignup);

router.post('/reset', authController.postReset);

router.post('/reset/:token', authController.postNewPassword);

module.exports = router;