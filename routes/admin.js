const { check, body } = require('express-validator');
const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { isAdmin, isEmployee } = require('../middleware/is-auth');

// /admin/add-product => GET
router.get(
  '/add-product',

  isAuth,
  isAdmin,
  adminController.getAddProduct
);

// /admin/products => GET
router.get(
  '/products',

  isAuth,
  isAdmin,
  adminController.getProducts
);

// /admin/add-product => POST
router.post('/add-product',
  isAuth,
  isAdmin,
  [
    body('title')
      .isString()
      .isLength({ min: 1 })
      .trim()
      .withMessage('Product name is not valid.'),
    body('category')
      .isString()
      .isLength({ min: 1 })
      .trim()
      .withMessage('Category is not valid.'),
    body('price')
      .isFloat()
      .withMessage('Price is not valid.'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity is not valid.'),
    body('description')
      .isLength({ min: 1 })
      .trim()
      .withMessage('Description is not valid.'),
    body('longDescription')
      .isLength({ min: 1 })
      .trim()
      .withMessage('Long description is not valid.')
  ],
  adminController.postAddProduct);

router.get('/edit-product/:productId',
  isAuth,
  isAdmin, adminController.getEditProduct
);
router.post(
  '/edit-product',
  isAuth,
  isAdmin,
  [
    body('title')
      .isString()
      .isLength({ min: 1 })
      .trim()
      .withMessage('Title is not valid.'),
    body('category')
      .isString()
      .isLength({ min: 1 })
      .trim()
      .withMessage('Category is not valid.'),
    body('price')
      .isFloat()
      .withMessage('Price is not valid.'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity is not valid.'),
    body('description')
      .isLength({ min: 1 })
      .trim()
      .withMessage('Description is not valid.'),
    body('longDescription')
      .isLength({ min: 1 })
      .trim()
      .withMessage('Long description is not valid.')
  ],
  adminController.postEditProduct
);

router.post(
  '/delete-product',
  isAuth,
  isAdmin,
  adminController.postDeleteProduct
);

router.get('/users',
  isAuth,
  adminController.getUsers
);

router.post(
  '/user/role',
  isAuth,
  isAdmin,
  adminController.updateRole
);

module.exports = router;
