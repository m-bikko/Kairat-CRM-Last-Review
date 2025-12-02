import mongoose, { Schema, models } from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: 'unlimited' | 'limited' | 'out_of_stock';
  stockQuantity?: number;
  status: 'active' | 'draft' | 'archived';
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      enum: ['unlimited', 'limited', 'out_of_stock'],
      default: 'unlimited',
    },
    stockQuantity: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    sku: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
