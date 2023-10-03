import { processPaginationResponse, processResponse } from '../middleware/handler/promise-controller';
import { User } from '../models/user';
import { MiddlewareModel } from '../util/models/middleware.model';

export const updateUser: MiddlewareModel = (req, res, next) => {
  console.log('updateUser');
  processResponse(req, res, next,
    User.findOneAndUpdate({ _id: req.body.userId }, req.body)
  );
};

export const getUsers: MiddlewareModel = (req, res, next) => {
  console.log('getUsers');
  processPaginationResponse(req, res, next,
    User.find()
  );
};

export const deleteUser: MiddlewareModel = (req, res, next) => {
  console.log('deleteUser');
  const { id } = req.body.params;

  processResponse(req, res, next,
    User.findByIdAndDelete(id)
  );
};