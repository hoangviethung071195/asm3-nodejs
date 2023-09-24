import { validationResult } from 'express-validator';
import { getError } from '../../util/error-object';
import { defaultPagination } from '../../util/constant/pagination';
import { ProcessHandlerModel } from '../../util/models/controller';

export const processResponse: ProcessHandlerModel = async (req, res, next, promise, callBack?, errorMessage = '') => {
  const r = handleProcess(req, res, next, promise, callBack, errorMessage);

  if (!callBack) {
    res.send(r);
  }
};

export const processPaginationResponse: ProcessHandlerModel = async (req, res, next, promise, callBack?, errorMessage = '') => {
  try {
    const { query } = req;
    const page = Number(query.page) || defaultPagination.page;
    const limit = Number(query.limit) || defaultPagination.limit;
    const total = await promise.count();
    const numberOfSkipedItems = limit * (page - 1);
    const list = handleProcess(
      req,
      res,
      next,
      promise.skip(numberOfSkipedItems).limit(limit),
      callBack,
      errorMessage
    );

    if (!callBack) {
      res.send({
        list,
        total
      });
    }
  } catch (err) {
    next(getError(500));
  }
};

const handleProcess: ProcessHandlerModel = async (req, res, next, promise, callBack?, errorMessage = '') => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const { msg } = error.array()[0];
      next(getError(422, msg));
    }

    const r = await promise;
    console.log('handlePromise', r);
    if (callBack) {
      callBack(r);
    } else if (r) {
      return r;
    } else {
      next(getError(400, errorMessage));
    }
  } catch (err) {
    next(getError(500));
  }
};