import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import Product, { ProductDocument } from '../models/product.model';
import { dbResponseTimeHistogram } from '../utils/metrics';

export async function createProduct(
  input: DocumentDefinition<
    Omit<ProductDocument, 'createdAt' | 'updatedAt' | 'productId'>
  >
) {
  const labels = { operation: 'createProduct' };
  const timer = dbResponseTimeHistogram.startTimer(labels);
  try {
    const result = await Product.create(input);
    timer({ ...labels, success: 'true' });
    return result;
  } catch (err: any) {
    timer({ ...labels, success: 'false' });
    throw new Error(err.message);
  }
}
export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  const labels = { operation: 'findProduct' };
  const timer = dbResponseTimeHistogram.startTimer(labels);
  try {
    const result = await Product.findOne(query, {}, options);
    timer({ ...labels, success: 'true' });
    return result;
  } catch (err: any) {
    timer({ ...labels, success: 'false' });
    throw new Error(err.message);
  }
}
export function findAndUpdate(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions
) {
  return Product.findOneAndUpdate(query, update, options);
}
export function deleteProduct(query: FilterQuery<ProductDocument>) {
  return Product.deleteOne(query);
}
