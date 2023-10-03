import { processPaginationResponse, processResponse } from '../middleware/handler/promise-controller';
import { Product } from '../models/product';
import { deleteFileInCloudStorage } from '../services/cloud-storage';
import { getValuableFieldsObj } from '../util/helpers/object';
import { MiddlewareModel } from '../util/models/middleware.model';

export const getProducts: MiddlewareModel = async (req, res, next) => {
  console.log('getProducts');
  const { keyword = '', category = '' } = req.query;
  const filterQuery = getValuableFieldsObj({ title: { $regex: keyword, $options: 'i' }, category });

  processPaginationResponse(req, res, next,
    Product.find(filterQuery)
  );
};

export const getProduct: MiddlewareModel = (req, res, next) => {
  console.log('getProduct');
  const { id } = req.params;

  processResponse(req, res, next,
    Product.findById(id)
  );
};

export const createProduct: MiddlewareModel = async (req, res, next) => {
  console.log('createProduct');
  const newInfo = req.body;

  processResponse(req, res, next,
    Product.create(newInfo)
  );
};

export const updateProduct: MiddlewareModel = async (req, res, next) => {
  console.log('updateProduct');
  const { id } = req.params;
  const newInfo = req.body;

  if (newInfo.fileIds?.length) {
    const product = await Product.findById(id);
    await deleteFileInCloudStorage(product.fileIds);
  }

  processResponse(req, res, next,
    Product.findByIdAndUpdate(id, newInfo)
  );
};

export const deleteProduct: MiddlewareModel = (req, res, next) => {
  console.log('deleteProduct');
  const { id } = req.params;
  processResponse(req, res, next,
    Product.findByIdAndDelete(id), (r) => {
      if (r) {
        deleteFileInCloudStorage(r.fileIds)
          .then(r => {
            if (r) {
              res.send(true);
            }
          });
      }
    }
  );
};
