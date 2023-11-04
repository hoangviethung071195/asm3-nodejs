import express from 'express';
import { postCustomerMail } from '../controllers/mail';
const router = express.Router();

router.post('/mail',
  postCustomerMail);

export const mailRoutes = router;
