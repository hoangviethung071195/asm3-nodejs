const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        require: true
      },
      quantity: {
        type: Number,
        require: true
      }
    }
  ],
  user: {
    email: {
      type: String,
      require: true
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
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
    address: {
      type: String,
      require: true
    },
  }
});

module.exports = mongoose.model('Order', orderSchema);