import jsonwebtoken from 'jsonwebtoken';
import { getError } from './error-object';
import { MiddlewareModel } from './models/controller';

export const getBearerInfo: MiddlewareModel = (req, res, next) => {
  const AuthorizationHeader = req.get('Authorization');
  const token = AuthorizationHeader?.split(' ')?.[1];
  if (!token) {
    next(getError(401));
  }
  try {
    if (token) {
      const bearerInfo = jsonwebtoken.verify(token, process.env.SECRET_BEARER_KEY);
      return bearerInfo;
    }
  } catch (error) {
    next(getError(401));
  }
};