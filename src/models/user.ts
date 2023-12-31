import mongoose, { Schema } from 'mongoose';

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

userSchema.methods.addToCart = function (updatedCart: { items: { productId: string; quantity: number; }[]; }) {
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId: number) {
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

export const User = mongoose.model('User', userSchema);