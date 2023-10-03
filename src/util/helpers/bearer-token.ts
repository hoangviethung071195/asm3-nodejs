import jsonwebtoken from 'jsonwebtoken';
import { getError } from './error-object';
import { MiddlewareModel } from '../models/middleware.model';

export const getBearerInfo: MiddlewareModel = (req, res, next) => {
  const AuthorizationHeader = req.get('Authorization');
  const token = AuthorizationHeader?.split(' ')?.[1];
  console.log('token');
  if (!token) {
    next(getError(401));
    return
  }
  try {
    if (token) {
      console.log('okokok');
      const bearerInfo = jsonwebtoken.verify(token, process.env.SECRET_BEARER_KEY);
      return bearerInfo;
    }
  } catch (error) {
    next(getError(401));
  }
};