import buildServer from './server';

const server = buildServer();

async function main() {
  try {
    await server.listen(3001, '0.0.0.0');

    console.log(`Server is running on port http://localhost:3001 🔥`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
