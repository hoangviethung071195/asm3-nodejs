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
    type: String,
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
  imageUrls: [String],
  imageUrl1: {
    type: String,
    require: true
  },
  imageUrl2: {
    type: String,
    require: true
  },
  imageUrl3: {
    type: String,
    require: true
  },
  imageUrl4: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

export const Product = mongoose.model('Product', productSchema);
