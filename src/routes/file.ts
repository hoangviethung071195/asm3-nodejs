import { Router } from 'express';
import { isAuthentizated } from '../middleware/validation/auth/authentization';
import { uploadFiles } from '../controllers/file';
import { customMulter } from '../services/multer';
import { IMAGE_MIME_TYPE } from '../util/constant/file';
export const fileRoutes = Router();


fileRoutes.post('/files/upload',
  isAuthentizated,
  customMulter(undefined, IMAGE_MIME_TYPE, undefined, 4),
  uploadFiles
);
