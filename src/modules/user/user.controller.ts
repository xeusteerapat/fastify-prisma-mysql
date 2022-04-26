import { verifyPassword, hashPassword } from './../../libs/hash';
import { CreateUserInputSchema, LoginInputSchema } from './user.schema';
import { createUser, findUserByEmail, findUsers } from './user.service';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInputSchema;
  }>,
  reply: FastifyReply
) {
  const { body } = request;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (error) {
    console.log(error);
    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInputSchema;
  }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  // find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    return reply.code(401).send({
      message: 'Invalid Email or Password',
    });
  }

  // verify password
  const verifiedPassword = verifyPassword({
    userPassword: password,
    salt: user.salt,
    hash: user.password,
  });

  if (verifiedPassword) {
    const { password, salt, ...rest } = user;

    return {
      accessToken: request.jwt.sign(rest),
    };
  }

  return reply.code(401).send({
    message: 'Invalid Email or Password',
  });
}

export async function getUserHandler() {
  const users = await findUsers();

  return users;
}
