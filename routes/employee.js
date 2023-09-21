const { check, body } = require('express-validator');
const path = require('path');

const express = require('express');

const employeeController = require('../controllers/employee');

const router = express.Router();

router.post('/login', employeeController.postLogin);

router.post('/signup', employeeController.postSignup);

router.post('/chat-room', employeeController.postMessage);

router.get('/chat-room/:customerId', employeeController.getChatRoom);

router.get('/chat-room/', employeeController.getChatRooms);

router.get('/chat-room/delete/:customerId', employeeController.deleteChatRoom);

module.exports = router;
