import { processResponse } from '../middleware/handler/promise-controller';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { User } from '../models/user';
import { MiddlewareModel } from '../util/models/controller';
import { sendOrderInfoToMail } from '../util/transport-mailer';

export const createOrder: MiddlewareModel = (req, res, next) => {
  let user;
  User.findById(req.body.userId)
    .populate('cart.items.productId')
    .then(async (u) => {
      user = u;
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: {
            ...i.productId._doc
          }
        };
      });

      try {
        const productsInStock = await Product.find({
          '_id': {
            $in: products.map(p => p.product._id)
          }
        });

        for (let i = 0; i < productsInStock.length; i++) {
          const pInStock = productsInStock[i];
          const pInCart = products.find(p => {
            return p.product._id.toString() === pInStock.id;
          });

          if (Number(pInCart?.quantity) > Number(pInStock.quantity)) {
            res.status(422).send({
              message: pInStock.title + '" is only ' + pInStock.quantity + ' products left.'
            });
            return;
          }

          pInStock.quantity = (pInStock.quantity || 0) - Number(pInCart?.quantity);
        }
        productsInStock.forEach(p => {
          p.save();
        });
      } catch (error) {
        console.log('error ', error);
      }

      const order = new Order({
        user: req.body,
        products
      });

      order.save()
        .then((r) => {
          user.clearCart();
          res.send(r.id);
          const { email, fullName, address, phone } = req.body;
          sendOrderInfoToMail(email, fullName, phone, address, products);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

export const getOrders: MiddlewareModel = (req, res, next) => {
  console.log('getAllOrders');
  processResponse(req, res, next,
    Order.find()
  );
};

export const getOrder: MiddlewareModel = (req, res, next) => {
  console.log('getOrder');
  const { orderId } = req.params;

  processResponse(req, res, next,
    Order.findById(orderId)
  );
};

export const getOrdersByUser: MiddlewareModel = (req, res, next) => {
  console.log('getOrders');
  const { userId } = req.body;

  processResponse(req, res, next,
    Order.find({ 'user.userId': userId })
  );
};
