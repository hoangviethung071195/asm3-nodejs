import { isArray } from 'lodash';
import { processResponse } from '../middleware/handler/promise-controller';
import { uploadFilesToCloudStorage } from '../services/cloud-storage';
import { MiddlewareModel } from '../util/models/middleware.model';

export const uploadFiles: MiddlewareModel = async (req, res, next) => {
  console.log('req.files ', req.files);

  if (isArray(req.files)) {
    console.log('isArray');
    processResponse(req, res, next,
      uploadFilesToCloudStorage(req.files),
    );
  }
};
