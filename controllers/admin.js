const mongodb = require('mongodb');
const Product = require('../models/product');
const { validationResult } = require('express-validator');
const deleteFile = require('../util/file');
const { getIO } = require('../socket');
const User = require('../models/user');

const ITEMS_PER_PAGE = 999;

exports.getAddProduct = (req, res, next) => {
  // res.render('admin/edit-product', {
  //   pageTitle: 'Add Product',
  //   path: '/admin/add-product',
  //   editing: false
  // });

};

const FileReader = require('filereader');
exports.postAddProduct = (req, res, next) => {
  const images = req.files;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).send({ message: error.array()[0].msg });
  }

  const product = new Product({
    ...req.body,
    title: req.body.title,
    userId: req.user,
    imageUrl1: 'data:image/png;base64,' + images[0].buffer.toString('base64'),
    imageUrl2: 'data:image/png;base64,' + images[1].buffer.toString('base64'),
    imageUrl3: 'data:image/png;base64,' + images[2].buffer.toString('base64'),
    imageUrl4: 'data:image/png;base64,' + images[3].buffer.toString('base64'),
  });
  product
    .save()
    .then(r => res.send(true));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.send(false);
  }
  const prodId = req.params.productId;
  Product.findOne({ userId: req.user._id, _id: prodId })
    .then(product => {
      res.send(product);
    }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const images = req.files;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(' error ', error);
    return res.status(422).send({ message: error.array()[0].msg });
  }
  const prodId = req.body.productId;
  console.log('req.body', req.body);
  Product.findById(prodId)
    .then(product => {
      Object.assign(product, req.body);
      if (images.length) {
        product.imageUrl1 = 'data:image/png;base64,' + images[0].buffer.toString('base64');
        product.imageUrl2 = 'data:image/png;base64,' + images[1].buffer.toString('base64');
        product.imageUrl3 = 'data:image/png;base64,' + images[2].buffer.toString('base64');
        product.imageUrl4 = 'data:image/png;base64,' + images[3].buffer.toString('base64');
      }
      console.log('product', product);
      product
        .save()
        .then(() => { console.log('luu thanh cong'); res.send(true); })
        .catch(() => { });
    });
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  const { keyword = '' } = req.query;
  let totalItems;
  Product
    .find()
    .count()
    .then(numProducts => {
      totalItems = numProducts;
      return Product
        .find({
          title: { $regex: keyword.trim() }
        })
        .skip(ITEMS_PER_PAGE * (page - 1))
        .limit(ITEMS_PER_PAGE);
    }).then(prods => {
      console.log('prods ', prods);
      const products = prods.map(p => ({
        ...p,
        id: p._id
      }));
      res.send({
        products: prods,
        pagination: {
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        }
      });
    });

};

exports.postDeleteProduct = (req, res, next) => {
  console.log('postDeleteProduct ');
  console.log('req.body ', req.body);
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(p => {
      console.log('p ', p);
      Product.findByIdAndDelete(prodId)
        .then((r) => {
          console.log('r ', r);
          res.send(prodId);
        })
        .catch(err => console.log('eer', err));
    });

};

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.send(users);
    });
};

exports.updateRole = (req, res, next) => {
  console.log('updateRole ');
  console.log('req.body ', req.body);

  User.findById(req.body.userId)
    .then(user => {
      user.role = req.body.role;
      user.save().then(r => {
        res.send(user);
      });
    });
};