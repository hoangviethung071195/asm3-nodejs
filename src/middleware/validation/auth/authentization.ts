import { JwtPayload } from 'jsonwebtoken';
import { getBearerInfo } from '../../../util/bearer-token';
import { getError } from '../../../util/error-object';
import { MiddlewareModel } from '../../../util/models/controller';

export const isAuthentizated: MiddlewareModel = (req, res, next, role = 1) => {
  const bearerInfo = getBearerInfo(req, res, next) as JwtPayload;
  if (bearerInfo.role > role) {
    next(getError(403));
  }
  next();
};