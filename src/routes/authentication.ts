import { Router } from 'express';
import { login, signup, sendResetPasswordTokenToUserMail, updateUserPassword } from '../controllers/authentication';
import { validateLogin, validateSignup } from '../middleware/validation/auth/authentication';

const router = Router();

router.post('/login',
  validateLogin(),
  login
);

router.post('/signup',
  validateSignup(),
  signup
);

router.post('employee/signup',
  validateSignup(),
  signup.bind(null, 2)
);

router.post('/resetUserPassword',
  sendResetPasswordTokenToUserMail
);

router.post('/updateUserPassword',
  updateUserPassword
);

export const authenticationRoutes = router;