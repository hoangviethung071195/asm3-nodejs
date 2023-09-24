import mongoose, { Schema } from 'mongoose';

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

export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);