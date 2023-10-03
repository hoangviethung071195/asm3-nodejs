import { body } from 'express-validator';
import { User } from '../../../models/user';
import { getBearerInfo } from '../../../util/helpers/bearer-token';
import { MiddlewareModel } from '../../../util/models/middleware.model';

export const isAuthenticated: MiddlewareModel = (req, res, next) => {
  console.log('isAuthenticated');
  const bearerInfo = getBearerInfo(req, res, next);
  console.log('next');
  next();
};

export const validateLogin = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password', 'Please enter a password at least 8 characters.')
      .isLength({ min: 8 })
      .trim(),
  ];
};

export const validateSignup = () => {
  return [
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
  ];
};
