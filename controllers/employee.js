const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const ChatRoom = require('../models/chatRoom');
const { getIO } = require('../socket');
const mongoose = require('mongoose');

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
      const isForbidden = user.role >= 3;
      if (isForbidden) {
        const error = new Error('Forbidden!');
        error.statusCode = 403;
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
        fullName: user.fullName,
        role: user.role,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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
        role: 1,
        cart: { item: [] }
      })).save();
    }).then(() => {
      res.send(true);
    });;
};

exports.postMessage = (req, res, next) => {
  console.log('postMessage ');
  const { customerId, message } = req.body;
  const error = validationResult(req);
  console.log(error);
  if (!error.isEmpty()) {
    return res.status(422).send({ message: error.array()[0].msg });
  }

  ChatRoom.findOne({ customerId })
    .then(room => {
      console.log('room ', room);
      if (room) {
        room.message.push(message);
        return room.save().catch(err => console.log(err));
      } else {
        const newRoom = new ChatRoom({
          customerId: (customerId),
          message: [message]
        });
        return newRoom.save().catch(err => console.log(err));
      }
    })
    .then(r => {
      getIO().emit('to_employee', r);
      getIO().emit('to_customer', r);
      res.send(true);
    })
    .catch(err => console.log(err));
};

exports.getChatRoom = (req, res, next) => {
  console.log('getChatRoom');
  const { customerId } = req.params;
  console.log('customerId ', customerId);
  ChatRoom
    .findOne({ customerId })
    .then(chatRoom => {
      if (chatRoom) {
        res.send(chatRoom);
        return;
      }
    })
    .catch(err => console.log(err));
};

exports.getChatRooms = (req, res, next) => {
  ChatRoom
    .find()
    .then(chatRooms => {
      res.send(chatRooms);
    })
    .catch(err => console.log(err));
};

exports.deleteChatRoom = (req, res, next) => {
  console.log('deleteChatRoom');
  const { customerId } = req.params;
  ChatRoom
    .deleteOne({
      customerId
    })
    .then(r => {
      console.log('da xoa');
      res.send(true);
      getIO().emit('remove_room', customerId);
    })
    .catch(err => console.log(err));
};