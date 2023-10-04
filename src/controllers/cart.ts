import { processResponse } from '../middleware/handler/promise-controller';
import { User } from '../models/user';
import { MiddlewareModel } from '../util/models/middleware.model';

export const getCartByUser: MiddlewareModel = async (req, res, next) => {
  const { userId } = req.body;

  processResponse(req, res, next,
    User.findById(userId).populate('cart.items.productId'),
    (user) => {
      const items = user.cart.items.map(p => {
        return {
          product: p._doc.productId._doc,
          quantity: p.quantity
        };
      });
      res.json(items);
    }
  );
};

export const updateCartByUser: MiddlewareModel = (req, res, next) => {
  console.log('updateCartByUser');
  const { userId, cart } = req.body;
  processResponse(req, res, next,
    User.findOneAndUpdate(
      { _id: userId },
      { $set: { cart } },
    )
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
