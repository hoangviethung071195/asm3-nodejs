import mongoose, { Schema } from 'mongoose';


const productSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  quantity: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  longDescription: {
    type: String,
    require: true
  },
  fileIds: [String],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

export const Product = mongoose.model('Product', productSchema);
