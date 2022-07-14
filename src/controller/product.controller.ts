import { Request, Response } from 'express';
import {
  findProductInput,
  createProductInput,
  deleteProductInput,
  updateProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  deleteProduct,
  findAndUpdate,
  findProduct,
} from '../service/product.service';
import log from '../utils/logger';

export async function createProductHandler(
  req: Request<{}, {}, createProductInput['body']>,
  res: Response
) {
  const user = res.locals.user._id;
  const body = req.body;
  try {
    const product = await createProduct({ ...body, user });
    return res.status(200).send(product);
  } catch (err: any) {
    log.error(err.message);
    return res.status(409).send('An Error occured while creating the product');
  }
}
export async function updateProductHandler(
  req: Request<updateProductInput['params'], {}, updateProductInput['body']>,
  res: Response
) {
  const userId = res.locals.user._id;

  const { productId } = req.params;
  const update = req.body;
  try {
    const product = await findProduct({ productId });

    if (!product) {
      return res.status(404).send('Product Not Found');
    }
    if (String(product.user) !== userId) {
      return res
        .status(403)
        .send('You are not authorized to perform this operation');
    }
    const updatedProduct = await findAndUpdate({ productId }, update, {
      new: true,
    });
    return res.status(200).send(updatedProduct);
  } catch (err: any) {
    log.error(err.message);
    return res.status(500).send('An error occured while updating the product');
  }
}
export async function deleteProductHandler(
  req: Request<deleteProductInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) {
    return res.status(404).send('Product with given id not found');
  }

  if (String(product.user) !== userId) {
    return res
      .status(403)
      .send('You are not authorized to perform this operation');
  }

  await deleteProduct({ productId });

  return res.sendStatus(200);
}

export async function findProductHandler(
  req: Request<findProductInput['params']>,
  res: Response
) {
  const productId = req.params.productId;
  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
}
