import mongoose, { Schema } from 'mongoose';
import { IUser } from '../util/models/schema/user.model';

interface IUserMethods {
  removeFromCart(this: this, productId: number): Promise<this>;
}

const userSchema = new Schema<IUser, {}, IUserMethods>({
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

userSchema.methods.removeFromCart = function (this: InstanceType<typeof User>, productId: number) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

export const User = mongoose.model('User', userSchema);