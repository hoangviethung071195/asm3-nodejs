const fs = require('fs');
const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const pdfDocument = require('pdfkit');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');
const ITEMS_PER_PAGE = 9;
const nodemailer = require('nodemailer');

exports.getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product
    .find()
    .count()
    .then(numProducts => {
      totalItems = numProducts;
      return Product
        .find()
        .skip(ITEMS_PER_PAGE * (page - 1))
        .limit(ITEMS_PER_PAGE);
    }).then(prods => {
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

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((r) => {
      console.log('r ', r);
      res.send({ ...r._doc, id: r._id });
    });
};

exports.getIndex = async (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product
    .find()
    .count()
    .then(numProducts => {
      totalItems = numProducts;
      return Product
        .find()
        .skip(ITEMS_PER_PAGE * (page - 1))
        .limit(ITEMS_PER_PAGE);
    }).then(prods => {
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

exports.getCart = async (req, res, next) => {
  const { userId } = req.params;
  console.log('req.param', req.params);
  const user = await User.findById(userId);
  if (!user) {
    res.send(false);
    return;
  }
  console.log('user ok ', user);
  user
    .populate('cart.items.productId')
    .then((user) => {
      const products = [...user.cart.items].map(p => {
        return {
          ...p._doc.productId._doc,
          quantity: p.quantity
        };
      });
      console.log('products ', products);
      res.send(products);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const { quantity, userId } = req.body;
  Product.findById(prodId)
    .then(product => {
      User.findById(userId)
        .then(user => {
          user.addToCart({ product, quantity })
            .then(() => res.send(true));
        });
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId, userId } = req.body;
  User.findById(userId)
    .then(user => {
      user
        .removeFromCart(productId)
        .then(() => res.send(true));
    });

};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hoangviethung071195@gmail.com',
    pass: 'qysonmppaklbmxdl'
  }
});

exports.postOrder = (req, res, next) => {
  console.log('req.body.userId ', req.body);
  let user = {};
  User.findById(req.body.userId)
    .populate('cart.items.productId')
    .then(async (u) => {
      user = u;
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: {
            ...i.productId._doc
          }
        };
      });
      // check remain quantity
      try {
        const productsInStock = await Product.find({
          '_id': {
            $in: products.map(p => p.product._id)
          }
        });
        for (let i = 0; i < productsInStock.length; i++) {
          const pInStock = productsInStock[i];
          const pInCart = products.find(p => {
            return p.product._id.toString() === pInStock.id;
          });
          console.log('pInCart ', pInCart);
          if (pInCart.quantity > pInStock.quantity) {
            res.status(422).send({
              message: '"' + pInStock.title + '" is only ' + pInStock.quantity + ' products left.'
            });
            return;
          }
          pInStock.quantity -= pInCart.quantity;
        }
        productsInStock.forEach(p => {
          p.save();
        });
      } catch (error) {
        console.log('error ', error);
      }

      const order = new Order({
        user: req.body,
        products
      });
      order.save()
        .then((r) => {
          console.log('r ', r);
          user.clearCart();
          res.send(r.id);
          const { email, fullName, address, phone } = req.body;
          transporter.sendMail({
            from: '"Việt Hùng Hoàng" <hoangviethung071195@gmail.com>',
            to: `${email}, ${email}`,
            subject: 'Đơn đặt hàng',
            html: `
              <div style="background-color: rgb(36, 36, 36); color: white;">
              <h1 style="color: white;">
                xin chào ${fullName}
              </h1>
          
              <h3 style="color: white;">
                Phone: ${phone}
              </h3>
          
              <h3 style="color: white;">
                Adress: ${address}
              </h3>
          
              <table>
                <thead>
                  <tr>
                    <th style="border: 1px solid rgb(148, 148, 148);">Tên sản phẩm</th>
                    <th style="border: 1px solid rgb(148, 148, 148);">Hình ảnh</th>
                    <th style="border: 1px solid rgb(148, 148, 148);">Giá</th>
                    <th style="border: 1px solid rgb(148, 148, 148);">Số lượng</th>
                    <th style="border: 1px solid rgb(148, 148, 148);">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                ${products.map(({ product, quantity }) => (
              `
                <tr>
                  <th style="border: 1px solid rgb(148, 148, 148);">${product.title}</th>
                  <th style="border: 1px solid rgb(148, 148, 148);"><img
                      width="100px"
                      src="${product.imageUrl1.includes("://") ? product.imageUrl1 : process.env.PORT + product.imageUrl1}"
                      alt=""
                    ></th>
                  <th style="border: 1px solid rgb(148, 148, 148);">${(new Intl.NumberFormat("vi-VI", { style: 'currency', currency: 'VND', })).format(product.price)}</th>
                  <th style="border: 1px solid rgb(148, 148, 148);">${quantity}</th>
                  <th style="border: 1px solid rgb(148, 148, 148);">${(new Intl.NumberFormat("vi-VI", { style: 'currency', currency: 'VND', })).format(quantity * product.price)}</th>
                </tr>
              `
            ))
              }

                </tbody>
              </table>
          
              <h1>Tổng thanh toán:</h1>
              <h1>${(new Intl.NumberFormat("vi-VI", { style: 'currency', currency: 'VND', })).format(products.reduce((a, b) => a + +b.product.price * b.quantity, 0))}</h1>
              <h1>Cảm ơn bạn!</h1>
            </div>
          `
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.getAllOrders = (req, res, next) => {
  Order.find()
    .then(orders => {
      console.log('orders ', orders);
      res.send(orders);
    });
};

exports.getOrders = (req, res, next) => {
  const { userId } = req.body;
  console.log('userId ', userId);
  Order.find({ 'user.userId': userId })
    .then(orders => {
      console.log('orders ', orders);
      res.send(orders);
    });
};

exports.getOrder = (req, res, next) => {
  const { orderId } = req.params;
  console.log('orderId ', orderId);
  Order.findById(orderId)
    .then(order => {
      console.log('order ', order);
      res.send(order);
    });
};

exports.getInvoice = (req, res, next) => {
  const param = req.params.orderId;
  Order.findById(param)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      res.send(order);
    });

};

exports.getCheckout = (req, res, next) => {
  // res.render('shop/checkout', {
  //   path: '/checkout',
  //   pageTitle: 'Checkout'
  // });
};
