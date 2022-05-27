import { number, string, object, TypeOf } from 'zod';

const payload = {
  body: object({
    title: string({
      required_error: 'Product title is required ',
    }),
    price: number({
      required_error: 'Product price is required',
    }),
    image: string({
      required_error: 'Product image is required',
    }),
    description: string({
      required_error: 'Product image is required',
    }).min(120, 'description must be a minimum of 120 characters'),
  }),
};

const params = {
  params: object({
    productId: string({ required_error: 'Product Id is required' }),
  }),
};

export const createProductSchema = object({
  ...payload,
});

export const updateProductSchema = object({
  ...payload,
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export const findProductSchema = object({
  ...params,
});

export type createProductInput = TypeOf<typeof createProductSchema>;
export type updateProductInput = TypeOf<typeof updateProductSchema>;
export type deleteProductInput = TypeOf<typeof deleteProductSchema>;
export type findProductInput = TypeOf<typeof findProductSchema>;
