const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hoangviethung071195@gmail.com',
    pass: 'qysonmppaklbmxdl'
  }
});

exports.getLogin = (req, res, next) => {
  res.send(!!req.session.isLoggedIn);
};

exports.postLogin = (req, res, next) => {
  console.log('postLogin');
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).send({ message: error.array()[0].msg });
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then(user => {
      console.log('user ', user);
      if (!user) {
        return res.status(400).send({
          message: 'Thông tin đăng nhập không chính xác'
        });
      }
      const doMatch = bcrypt.compareSync(password, user.password);
      if (!doMatch) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
          role: user.role
        },
        'somesupersecretsecret',
        { expiresIn: '720h' }
      );
      res.status(200).json({
        token: token,
        userId: user._id.toString(),
        email: user.email,
        fullName: user.fullName
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.send(true);
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, fullName, phone } = req.body;
  const error = validationResult(req);
  console.log(error);
  if (!error.isEmpty()) {
    return res.status(422).send({ message: error.array()[0].msg });
  }

  bcrypt.hash(password, 12)
    .then((password) => {
      return (new User({
        email,
        password,
        fullName,
        phone,
        role: 3,
        cart: { item: [] }
      })).save();
    }).then(() => {
      res.send(true);
    });;
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    const token = buffer.toString('hex');
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return res.send({ message: 'No account with that email found.' });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        user
          .save()
          .then(r => {
            transporter.sendMail({
              from: '"Việt Hùng Hoàng" <hoangviethung071195@gmail.com>',
              to: `${email}, ${email}`,
              subject: 'Password reset',
              html: `
              <p>You requested a password reset</p>
              <p>Go to ${process.env.PORT}reset/${token} to set a new password.</p>
            `
            });
          }).then(() => res.send(true));
      });
  });
};

exports.postNewPassword = (req, res, next) => {
  const { password } = req.body;
  const resetToken = req.params.token;
  console.log('postNewPassword ', resetToken, password);
  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(400).send({ message: 'Email or reset token were not found.' });
      }
      const newPassword = bcrypt.hashSync(password, 12);
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      user.password = newPassword;
      user
        .save()
        .then(r => {
          res.send(true);
        });
    });
};