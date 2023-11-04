import { Router } from 'express';
import { authenticationRoutes } from './authentication';
import { cartRoutes } from './cart';
import { chatRoomRoutes } from './chat-room';
import { fileRoutes } from './file';
import { globalRoutes } from './global';
import { mailRoutes } from './mail';
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
router.use(fileRoutes);
router.use(mailRoutes);
router.use(globalRoutes);

export const routes = router; 