import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product';
import { isAuthentizated } from '../middleware/validation/auth/authentization';
import { validateProductForCreating, validateProductForUpdating } from '../middleware/validation/product';
import { PRODUCT_PATH, PLURAL, DYNAMIC_ID_ROUTE } from '../util/constant/routes';
const router = express.Router();

router.get(PRODUCT_PATH + PLURAL,
  getProducts
);

router.get(PRODUCT_PATH + DYNAMIC_ID_ROUTE,
  getProduct
);

router.post(PRODUCT_PATH,
  isAuthentizated,
  validateProductForCreating(),
  createProduct);

router.patch(PRODUCT_PATH,
  isAuthentizated,
  validateProductForUpdating(),
  updateProduct
);

router.delete(PRODUCT_PATH,
  isAuthentizated,
  deleteProduct
);

export const productRoutes = router;
