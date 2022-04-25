import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from 'fastify-jwt';
import userRoutes from './modules/user/user.routes';
import { userSchemas } from './modules/user/user.schema';

export const server = Fastify();

// type declaration for authenticate
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

// register plugins
server.register(fastifyJwt, {
  secret: process.env.FASTIFY_JWT_SECRET as string,
});

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.send(error);
    }
  }
);

server.get('/healthcheck', async () => {
  return {
    status: 'OK',
  };
});

async function main() {
  // register schemas before register routes
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: 'api/users' });

  try {
    await server.listen(3001, '0.0.0.0');

    console.log(`Server is running on port http://localhost:3001 🔥`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
