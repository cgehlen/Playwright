import { test, expect } from '@playwright/test';
let token: string;

test('Login senha inválida', async ({ request }) => {
  /**
   * @description Tenta login com senha inválida
   * 1. Faz post na rota /login com senha inválida
   * 2. Valida status code 401
   * 3. Valida mensagem "Email e/ou senha inválidos"
   **/
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

test('Login email inválido', async ({ request }) => {
  /**
   * @description Tenta login com email inválido
   * 1. Faz post na rota /login com email inválido
   * 2. Valida status code 401
   * 3. Valida mensagem "Email e/ou senha inválidos"
   **/
  const response = await request.post('/login', {
    data: {
      email: "fulano55@qa.com",
      password: "1234",
    }
  });
  expect(response.status()).toBe(401);
  const body = await response.json();
  token = body.authorization;
  expect(body.message).toBe("Email e/ou senha inválidos");
});

test('Login com sucesso', async ({ request }) => {
  /**
   * @description Login com sucesso
   * 1. Faz post na rota /login com senha válida
   * 2. Valida status code 200
   * 3. Valida mensagem "Login realizado com sucesso"
   **/
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