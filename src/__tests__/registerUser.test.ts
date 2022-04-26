import { test } from 'tap';
import { faker } from '@faker-js/faker';
import buildServer from '../server';
import { ImportMock } from 'ts-mock-imports';
import * as userService from '../modules/user/user.service';
import prisma from '../libs/prisma';

test('POST `/api/users` - create user successfully with mock user', async t => {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const id = Math.floor(Math.random() * 1000);

  const server = buildServer();
  const stub = ImportMock.mockFunction(userService, 'createUser', {
    name,
    email,
    id,
  });

  t.teardown(() => {
    server.close();
    stub.restore();
  });

  const response = await server.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      email,
      password,
      name,
    },
  });

  t.equal(response.statusCode, 201);
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8');

  const json = response.json();

  t.equal(json.name, name);
  t.equal(json.email, email);
  t.equal(json.id, id);
});

test('POST `/api/users` - create user successfully with database', async t => {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const server = buildServer();

  t.teardown(async () => {
    server.close();
    await prisma.user.deleteMany({});
  });

  const response = await server.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      email,
      password,
      name,
    },
  });

  t.equal(response.statusCode, 201);
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8');

  const json = response.json();

  t.equal(json.name, name);
  t.equal(json.email, email);
  t.type(json.id, 'number');
});

test('POST `/api/users` - fail to create a user', async t => {
  const name = faker.name.findName();
  const password = faker.internet.password();

  const server = buildServer();

  t.teardown(async () => {
    server.close();
    await prisma.user.deleteMany({});
  });

  const response = await server.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      password,
      name,
    },
  });

  t.equal(response.statusCode, 400);

  const json = response.json();

  t.equal(json.message, "body should have required property 'email'");
});
