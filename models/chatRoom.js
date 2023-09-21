const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
  message: [{
    isCustomer: Boolean,
    content: {
      type: String,
      require: true
    }
  }],
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    require: true
  },
  customerName: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);