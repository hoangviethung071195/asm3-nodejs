import { Product } from '../models/product';
import { processPaginationResponse, processResponse } from '../middleware/handler/promise-controller';
import { getBase64URL } from '../util/file';
import { MiddlewareModel } from '../util/models/controller';

export const getProducts: MiddlewareModel = async (req, res, next) => {
  console.log('getProducts');
  processPaginationResponse(req, res, next,
    Product.find()
  );
};

export const getProduct: MiddlewareModel = (req, res, next) => {
  console.log('getProduct');
  const { productId } = req.params;

  processResponse(req, res, next,
    Product.findById(productId)
  );
};

export const createProduct: MiddlewareModel = (req, res, next) => {
  console.log('createProduct');
  const { files } = req;
  let newInfo = req.body;

  if (files?.length === 4) {
    newInfo.imageUrls = (files as Express.Multer.File[]).map(f => getBase64URL(f));
  }

  processResponse(req, res, next,
    Product.create(newInfo)
  );
};

export const updateProduct: MiddlewareModel = (req, res, next) => {
  console.log('updateProduct');
  const { files } = req;
  const { productId } = req.body;
  let newInfo = req.body;

  if (files?.length === 4) {
    newInfo.imageUrls = (files as Express.Multer.File[]).map(f => getBase64URL(f));
  }

  processResponse(req, res, next,
    Product.findByIdAndUpdate(productId, newInfo)
  );
};

export const deleteProduct: MiddlewareModel = (req, res, next) => {
  console.log('deleteProduct');
  const { productId } = req.body;

  processResponse(req, res, next,
    Product.findByIdAndDelete(productId)
  );
};
