import { validationResult } from 'express-validator';
import { defaultPagination } from '../../util/constant/pagination';
import { ProcessHandlerModel } from '../../util/models/middleware.model';
import { cloneDeep } from 'lodash';
import { getError } from '../../util/helpers/error-object';

export const processResponse: ProcessHandlerModel = async (req, res, next, promise, callBack?, errorMessage = '') => {
  const r = await handleProcess(req, res, next, promise, callBack, errorMessage);
  if (!callBack && r) {
    res.json(r);
  }
};

export const processPaginationResponse: ProcessHandlerModel = async (req, res, next, promise, callBack?, errorMessage = '') => {
  try {
    const { query } = req;
    const { sort, sortBy } = query;
    const page = Number(query.page) || defaultPagination.page;
    const limit = Number(query.limit) || defaultPagination.limit;
    const total = await cloneDeep(promise).count();
    const numberOfSkipedItems = limit * (page - 1);
    // console.log('page', page);
    // console.log('limit', limit);
    // console.log('total', total);
    // console.log('numberOfSkipedItems', numberOfSkipedItems);
    console.log('sort ', sort);
    console.log('sortBy ', sortBy);
    const list = await handleProcess(
      req,
      res,
      next,
      promise.sort({ [sortBy as string]: sort }).skip(numberOfSkipedItems).limit(limit),
      callBack,
      errorMessage
    );

    // console.log('processPaginationResponse', list[0]);
    if (!callBack) {
      res.json({
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

    if (callBack) {
      callBack(r);
    } else if (r) {
      return r;
    } else if (r === null) {
      res.send(null);
    } else {
      next(getError(400, errorMessage));
    }
  } catch (err) {
    console.log('catch', JSON.stringify(err));
    next(getError(500));
  }
};