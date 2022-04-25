import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from 'fastify-jwt';
import userRoutes from './modules/user/user.routes';
import { productSchemas } from './modules/product/product.schema';
import { userSchemas } from './modules/user/user.schema';
import productRoutes from './modules/product/product.routes';
import swagger from 'fastify-swagger';
import { withRefResolver } from 'fastify-zod';
import { version } from '../package.json';

export const server = Fastify();

// type declaration for authenticate
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module 'fastify-jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
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

  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      routePrefix: '/docs',
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: 'Fastify API',
          description: 'Example API created from Fastify and Prisma',
          version,
        },
      },
    })
  );

  server.register(userRoutes, { prefix: 'api/users' });
  server.register(productRoutes, { prefix: 'api/products' });

  try {
    await server.listen(3001, '0.0.0.0');

    console.log(`Server is running on port http://localhost:3001 🔥`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
