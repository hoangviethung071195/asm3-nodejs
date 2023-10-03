import { JwtPayload } from 'jsonwebtoken';
import { getBearerInfo } from '../../../util/helpers/bearer-token';
import { MiddlewareModel } from '../../../util/models/middleware.model';
import { getError } from '../../../util/helpers/error-object';

export const isAuthentizated: MiddlewareModel = (req, res, next, role = 1) => {
  const bearerInfo = getBearerInfo(req, res, next) as JwtPayload;
  if (bearerInfo.role > role) {
    next(getError(403, 'Employees do not have permission to submit this action!'));
  }
  next();
};