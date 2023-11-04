import { sendCustomerInfo } from '../services/transport-mailer';
import { MiddlewareModel } from '../util/models/middleware.model';

export const postCustomerMail: MiddlewareModel = async (req, res, next) => {
  console.log('postCustomerMail');
  const { email, fullName, message } = req.body;
  console.log('req.body ', req.body);
  sendCustomerInfo(email, fullName, message)
    .then(r => {
      res.send(true);
    });
};
