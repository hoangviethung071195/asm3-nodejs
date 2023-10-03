import { processResponse } from '../middleware/handler/promise-controller';
import { User } from '../models/user';
import { MiddlewareModel } from '../util/models/middleware.model';

export const getCartByUser: MiddlewareModel = async (req, res, next) => {
  const { userId } = req.body;

  processResponse(req, res, next,
    User.findById(userId).populate('cart.items.productId'),
    (user) => {
      const cart = [...user.cart.items].map(p => {
        return {
          product: p._doc.productId._doc,
          quantity: p.quantity
        };
      });
      res.json(cart);
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
        .then(() => res.json(true));
    }
  );
};

export const deleteProductsInCartByUser: MiddlewareModel = (req, res, next) => {
  const { productId, userId } = req.body;

  processResponse(req, res, next,
    User.findById(userId),
    user => {
      user
        .removeFromCart(productId)
        .then(() => res.json(true));
    }
  );
};
