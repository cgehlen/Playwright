import { test, expect } from '@playwright/test';

let token: string;

test('Listar pets pelo status - available', async ({ request }) => {
  /**
   * @description Lista pets pelo status
   * 1. Faz GET na rota /pet/findByStatus?status=available
   * 2. Valida status code 200
   * 3. Valida que o retorno é um array
   * 4. Valida estrutura mínima de um pet
   * 5. Exibe os pets no console
   */
  const response = await request.get('/pet/findByStatus?status=available');
  expect(response.status()).toBe(200);

  const body = await response.json();

  // O retorno deve ser um array
  expect(Array.isArray(body)).toBe(true);

  if (body.length > 0) {
    const pet = body[0];
    expect(pet).toHaveProperty('id');
    expect(pet).toHaveProperty('category');
    expect(pet.category).toHaveProperty('id');
    expect(pet.category).toHaveProperty('name');
    expect(pet).toHaveProperty('name');
    expect(Array.isArray(pet.photoUrls)).toBe(true);
    expect(Array.isArray(pet.tags)).toBe(true);
    expect(pet).toHaveProperty('status');
  }

  console.log(body);
});

test('Listar pets pelo status - pending', async ({ request }) => {
  /**
   * @description Lista pets pelo status
   * 1. Faz GET na rota /pet/findByStatus?status=available
   * 2. Valida status code 200
   * 3. Valida que o retorno é um array
   * 4. Valida estrutura mínima de um pet
   * 5. Exibe os pets no console
   */
  const response = await request.get('/pet/findByStatus?status=pending');
  expect(response.status()).toBe(200);

  const body = await response.json();

  // O retorno deve ser um array
  expect(Array.isArray(body)).toBe(true);

  if (body.length > 0) {
    const pet = body[0];
    expect(pet).toHaveProperty('id');
    expect(pet).toHaveProperty('category');
    expect(pet.category).toHaveProperty('id');
    expect(pet.category).toHaveProperty('name');
    expect(pet).toHaveProperty('name');
    expect(Array.isArray(pet.photoUrls)).toBe(true);
    expect(Array.isArray(pet.tags)).toBe(true);
    expect(pet).toHaveProperty('status');
  }

  console.log(body);
});

test('Listar pets pelo status - sold', async ({ request }) => {
  /**
   * @description Lista pets pelo status
   * 1. Faz GET na rota /pet/findByStatus?status=available
   * 2. Valida status code 200
   * 3. Valida que o retorno é um array
   * 4. Valida estrutura mínima de um pet
   * 5. Exibe os pets no console
   */
  const response = await request.get('/pet/findByStatus?status=sold');
  expect(response.status()).toBe(200);

  const body = await response.json();

  // O retorno deve ser um array
  expect(Array.isArray(body)).toBe(true);

  if (body.length > 0) {
    const pet = body[0];
    expect(pet).toHaveProperty('id');
    expect(pet).toHaveProperty('category');
    expect(pet.category).toHaveProperty('id');
    expect(pet.category).toHaveProperty('name');
    expect(pet).toHaveProperty('name');
    expect(Array.isArray(pet.photoUrls)).toBe(true);
    expect(Array.isArray(pet.tags)).toBe(true);
    expect(pet).toHaveProperty('status');
  }

  console.log(body);
});