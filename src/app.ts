import Fastify from 'fastify';
import userRoutes from './modules/user/user.routes';

const server = Fastify();

server.get('/healthcheck', async () => {
  return {
    status: 'OK',
  };
});

async function main() {
  server.register(userRoutes, {
    prefix: 'api/users',
  });

  try {
    await server.listen(3001, '0.0.0.0');

    console.log(`Server is running on port http://localhost:3001 🔥`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
