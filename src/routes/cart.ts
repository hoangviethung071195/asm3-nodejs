import { Router } from 'express';
import { isAuthenticated } from '../middleware/validation/auth/authentication';
import { getCartByUser, updateCartByUser, deleteProductsInCartByUser } from '../controllers/cart';
import { CART_PATH } from '../util/constant/routes';

const router = Router();

router.post(CART_PATH + '/getCartByUser',
  isAuthenticated,
  getCartByUser
);

router.post(CART_PATH,
  isAuthenticated,
  updateCartByUser
);

router.delete(CART_PATH,
  isAuthenticated,
  deleteProductsInCartByUser
);

export const cartRoutes = router;
