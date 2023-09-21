const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get(
  '/carts/:userId',
  isAuth,
  shopController.getCart
);

router.post(
  '/carts',
  isAuth,
  shopController.postCart
);

router.post(
  '/cart-delete-item',
  isAuth,
  shopController.postCartDeleteProduct
);

router.post(
  '/create-order',
  isAuth,
  shopController.postOrder
);

router.get(
  '/orders/:orderId',
  isAuth,
  shopController.getInvoice
);

router.post(
  '/orders',
  isAuth,
  shopController.getOrders
);

router.get(
  '/orders',
  isAuth,
  shopController.getAllOrders
);

router.get(
  '/checkout',
   isAuth,
  shopController.getCheckout
);

module.exports = router;
