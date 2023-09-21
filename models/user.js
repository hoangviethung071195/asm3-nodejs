const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  fullName: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  role: {
    type: Number,
    require: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          require: true
        },
        quantity: {
          type: Number,
          require: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function ({ product, quantity }) {
  console.log('this ', this);
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = quantity;
  console.log('newQuantity ', newQuantity);
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity += this.cart.items[cartProductIndex].quantity;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: (product._id),
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  console.log('this.cart.items ', this.cart.items);
  console.log('productId ', productId);
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);