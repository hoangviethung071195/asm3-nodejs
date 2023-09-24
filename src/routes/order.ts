import { Router } from 'express';
import { isAuthenticated } from '../middleware/validation/auth/authentication';
import { createOrder, getOrdersByUser, getOrders, getOrder } from '../controllers/order';
import { PLURAL, ORDER_PATH, DYNAMIC_ID_ROUTE } from '../util/constant/routes';

const router = Router();

router.get(ORDER_PATH + PLURAL,
  isAuthenticated,
  getOrders
);

router.get(ORDER_PATH + DYNAMIC_ID_ROUTE,
  isAuthenticated,
  getOrder
);

router.post(ORDER_PATH + PLURAL,
  isAuthenticated,
  getOrdersByUser
);

router.post(ORDER_PATH,
  isAuthenticated,
  createOrder
);

export const orderRoutes = router;
