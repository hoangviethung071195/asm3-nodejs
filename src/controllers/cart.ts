import { processResponse } from '../middleware/handler/promise-controller';
import { User } from '../models/user';
import { MiddlewareModel } from '../util/models/controller';

export const getCartByUser: MiddlewareModel = async (req, res, next) => {
  const { userId } = req.body;

  processResponse(req, res, next,
    User.findById(userId).populate('cart.items.productId'),
    (user) => {
      const products = [...user.cart.items].map(p => {
        return {
          ...p._doc.productId._doc,
          quantity: p.quantity
        };
      });
      res.send(products);
    }
  );
};

export const updateCartByUser: MiddlewareModel = (req, res, next) => {
  const { quantity, userId, productId } = req.body;

  processResponse(req, res, next,
    User.findById(userId),
    user => {
      user
        .addToCart(productId, quantity)
        .then(() => res.send(true));
    }
  );
};

export const deleteCartByUser: MiddlewareModel = (req, res, next) => {
  const { productId, userId } = req.body;

  processResponse(req, res, next,
    User.findById(userId),
    user => {
      user
        .removeFromCart(productId)
        .then(() => res.send(true));
    }
  );
};
