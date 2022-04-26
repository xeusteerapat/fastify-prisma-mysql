import { test } from 'tap';
import buildServer from '../server';

test('request the /healthcheck route', async t => {
  const server = buildServer();

  // finish test and teardown the server
  t.teardown(() => {
    server.close();
  });

  const response = await server.inject({
    method: 'GET',
    url: '/healthcheck',
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { status: 'OK' });
});
