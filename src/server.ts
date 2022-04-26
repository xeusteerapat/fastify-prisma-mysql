import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt, { JWT } from 'fastify-jwt';
import userRoutes from './modules/user/user.routes';
import { productSchemas } from './modules/product/product.schema';
import { userSchemas } from './modules/user/user.schema';
import productRoutes from './modules/product/product.routes';
import swagger from 'fastify-swagger';
import { withRefResolver } from 'fastify-zod';
import { version } from '../package.json';

// type declaration for authenticate
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
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

function buildServer() {
  const server = Fastify();

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

  // add hook
  server.addHook('preHandler', (req, res, next) => {
    req.jwt = server.jwt;
    return next();
  });

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

  return server;
}

export default buildServer;
