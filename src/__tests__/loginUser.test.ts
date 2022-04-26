import { faker } from '@faker-js/faker';
import { UserType } from 'fastify-jwt';
import { test } from 'tap';
import prisma from '../libs/prisma';
import buildServer from '../server';

test('POST `/api/users/login`', async () => {
  test('given the email and password are correct', async t => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const server = buildServer();

    t.teardown(async () => {
      server.close();
      await prisma.user.deleteMany({});
    });

    // register fake user
    await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        email,
        password,
        name,
      },
    });

    // then use fake user to login
    const response = await server.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        email,
        password,
      },
    });

    t.equal(response.statusCode, 200);

    const verified = server.jwt.verify<UserType & { iat: number }>(
      response.json().accessToken
    );

    t.equal(verified.email, email);
    t.equal(verified.name, name);
    t.type(verified.id, 'number');
  });

  test('given the email and password are not correct', async t => {
    test('given the email and password are correct', async t => {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password();

      const server = buildServer();

      t.teardown(async () => {
        server.close();
        await prisma.user.deleteMany({});
      });

      // register fake user
      await server.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          email,
          password,
          name,
        },
      });

      // then use fake user to login
      const response = await server.inject({
        method: 'POST',
        url: '/api/users/login',
        payload: {
          email,
          password: 'wrong password',
        },
      });

      t.equal(response.statusCode, 401);

      const json = response.json();

      t.equal(json.message, 'Invalid Email or Password');
    });
  });
});
