import prisma from '../../libs/prisma';
import { CreateProductInput } from './product.schema';

export const createProduct = async (
  data: CreateProductInput & { ownerId: number }
) => {
  return prisma.product.create({
    data,
  });
};

export const getProducts = async () => {
  return prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};
