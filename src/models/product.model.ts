import mongoose from 'mongoose';
import { UserDocument } from './user.model';
import { customAlphabet } from 'nanoid';

const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export interface ProductDocument extends mongoose.Document {
  user: UserDocument['_id'];
  title: string;
  price: number;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: String,
      required: true,
      default: () => `product_${nanoId()} `,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<ProductDocument>('Product', productSchema);

export default Product;
