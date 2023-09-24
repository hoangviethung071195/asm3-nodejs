import { Router } from 'express';
import { authenticationRoutes } from './authentication';
import { cartRoutes } from './cart';
import { chatRoomRoutes } from './chat-room';
import { orderRoutes } from './order';
import { productRoutes } from './product';
import { userRoutes } from './user';
const router = Router();

router.use(authenticationRoutes);
router.use(cartRoutes);
router.use(chatRoomRoutes);
router.use(orderRoutes);
router.use(productRoutes);
router.use(userRoutes);

export const routes = router; 