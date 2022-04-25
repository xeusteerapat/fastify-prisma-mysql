import { CreateProductInput } from './product.schema';
import { createProduct } from './product.service';
import { FastifyRequest, FastifyReply } from 'fastify';
export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>
) {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id,
  });

  return product;
}
