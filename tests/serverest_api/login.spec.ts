import { test, expect } from '@playwright/test';
let token: string;

test('Login senha inválida', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      email: "fulano@qa.com",
      password: "1234",
    }
  });
  expect(response.status()).toBe(401);
  const body = await response.json();
  token = body.authorization;
  expect(body.message).toBe("Email e/ou senha inválidos");
});

test('Login com sucesso', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      email: "fulano@qa.com",
      password: "teste",
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('authorization');
  expect(body.message).toBe("Login realizado com sucesso");
});