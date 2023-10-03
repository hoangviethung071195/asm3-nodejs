import { getStorageApiEndpoint } from '../util/helpers/file';
import { MiddlewareModel } from '../util/models/middleware.model';

export const getGlobalSetting: MiddlewareModel = async (req, res, next) => {
  console.log('getGlobalSetting');
  const storageApiEndpoint = getStorageApiEndpoint();

  res.json({
    storageApiEndpoint
  });
};
