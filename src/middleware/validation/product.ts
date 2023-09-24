import { body } from 'express-validator';

export const validateProductForCreating = () => {
  return [
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
  ];
};

export const validateProductForUpdating = () => {
  return [
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
  ];
};