import { Router } from 'express';
import { isAuthenticated } from '../middleware/validation/auth/authentication';
import { isAuthentizated } from '../middleware/validation/auth/authentization';
import { updateUser, getUsers, deleteUser } from '../controllers/user';
import { USER_PATH, PLURAL, DYNAMIC_ID_ROUTE } from '../util/constant/routes';
const router = Router();

router.get(USER_PATH + PLURAL,
  isAuthenticated,
  getUsers
);

router.put(USER_PATH,
  isAuthentizated,
  updateUser
);

router.delete(USER_PATH + DYNAMIC_ID_ROUTE,
  isAuthentizated,
  deleteUser
);

export const userRoutes = router;
