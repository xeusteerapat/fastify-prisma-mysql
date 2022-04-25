import { hashPassword } from './../../libs/hash';
import { CreateUserInputSchema } from './user.schema';
import prisma from '../../libs/prisma';

export const createUser = async (input: CreateUserInputSchema) => {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      ...rest,
      salt,
      password: hash,
    },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const findUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });

  return users;
};
