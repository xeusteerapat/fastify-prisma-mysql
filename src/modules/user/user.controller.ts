import { CreateUserInputSchema } from './user.schema';
import { createUser } from './user.service';
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
