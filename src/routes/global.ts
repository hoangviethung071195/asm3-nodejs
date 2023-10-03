import { Router } from 'express';
import { getGlobalSetting } from '../controllers/global';

const router = Router();

router.get('/globalSetting',
  getGlobalSetting
);

export const globalRoutes = router;