import Fastify from 'fastify';
import userRoutes from './modules/user/user.routes';
import { userSchemas } from './modules/user/user.schema';

const server = Fastify();

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
