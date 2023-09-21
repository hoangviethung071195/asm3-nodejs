const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();

const { v4: uuidv4 } = require('uuid');

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('file ', file);
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const cors = require('cors');
app.use(cors({
  credentials: true,
  origin: true
}));
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer().array('image', 4)
);
app.use(express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const adminRoutes = require('./routes/admin');
const employee = require('./routes/employee');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(authRoutes);
app.use('/employee', employee);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect('mongodb+srv://hoangviethung071195:hungnho123@project0.anbpvsu.mongodb.net/asm3')
  .then(result => {
    const PORT = process.env.PORT || 5000;
    console.log('PORT ', PORT);
    const server = app.listen(PORT);
    const io = require('./socket').connect(server);
    io.on('connection', socket => {
      console.log('da ket noi voi socket');
    });
  })
  .catch(err => console.log(err));
