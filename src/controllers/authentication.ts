import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { processResponse } from '../middleware/handler/promise-controller';
import { getError } from '../util/error-object';
import { sendMail } from '../util/transport-mailer';
import { API_ENDPOINT } from '../util/constant/env';
import { MiddlewareExtraParamModel, MiddlewareModel } from '../util/models/controller';

export const login: MiddlewareModel = (req, res, next) => {
  console.log('login');
  const { email, password } = req.body;

  processResponse(req, res, next,
    User.findOne({ email }),
    (user) => {
      if (!user) {
        next(getError(400, 'Email does not exists.'));
      }

      const doMatch = bcrypt.compareSync(password, user.password);
      if (!doMatch) {
        next(getError(401, 'Wrong password!'));
      }

      const { _id, role, fullName } = user;
      const token = jwt.sign(
        {
          email: email,
          userId: _id.toString(),
          role
        },
        process.env.SECRET_BEARER_KEY,
        { expiresIn: '720h' }
      );

      res.send({
        token,
        userId: user._id.toString(),
        email,
        fullName
      });
    }
  );
};

export const signup: MiddlewareExtraParamModel<number> = (req, res, next, role) => {
  const { email, password, fullName, phone } = req.body;

  processResponse(req, res, next,
    User.findOne({ email }),
    user => {
      if (user) {
        next(getError(400, 'Email already exists'));
      }

      const hashPassword = bcrypt.hashSync(password, 12);
      const newUpdate = {
        email,
        password: hashPassword,
        fullName,
        phone,
        role: role,
        cart: { item: [] }
      };

      User
        .create(newUpdate)
        .then(r => res.send(r));

    }
  );
};

export const sendResetPasswordTokenToUserMail: MiddlewareModel = (req, res, next) => {
  const { email, token } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return next(getError(400, err.message));
    }

    const oneHour = 60 * 60 * 1000;
    const resetToken = buffer.toString('hex');
    const newUpdate = {
      resetToken,
      resetTokenExpiration: Date.now() + oneHour
    };

    processResponse(req, res, next,
      User.findOneAndUpdate({ email }, newUpdate),
      r => {
        if (!r) {
          next(getError(400, 'Email does not exists'));
        }
        sendMail({
          from: '"Việt Hùng Hoàng" <hoangviethung071195@gmail.com>',
          to: `${email}, ${email}`,
          subject: 'Password reset',
          html: `
          <p>You requested a password reset</p>
          <p>Go to ${API_ENDPOINT}/reset/${token} to set a new password.</p>
        `
        });
      }
    );
  });
};

export const updateUserPassword: MiddlewareModel = (req, res, next) => {
  const { password, resetToken } = req.body;
  const newPassword = bcrypt.hashSync(password, 12);
  const newInfo = {
    password: newPassword,
    resetToken: undefined,
    resetTokenExpiration: undefined,
  };

  processResponse(req, res, next,
    User.updateOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } }, newInfo),
    undefined,
    'Email or reset token were not found.'
  );
};