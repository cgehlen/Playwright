import { test, expect } from '@playwright/test';
import path from 'path';
const filePath = path.join('./tests/petshop_api/assets/dog.webp');

let token: string;

test.describe.serial('GET pelos status', () => {

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

  test('Listar pets pelo status - available 400', async ({ request }) => {
    /**
     * @description Lista pets pelo status
     * 1. Faz GET na rota /pet/findByStatus?status=available
     * 2. Valida status code 400
     * 3. Valida que o retorno é um array
     * 4. Valida estrutura mínima de um pet
     * 5. Exibe os pets no console
     */
    const response = await request.get('/pet/findByStatus?status=available');
    expect(response.status()).toBe(400);
    const body = await response.json();
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

  test('Listar pets pelo status - pending 400', async ({ request }) => {
    /**
     * @description Lista pets pelo status
     * 1. Faz GET na rota /pet/findByStatus?status=pending
     * 2. Valida status code 400
     * 3. Valida que o retorno é um array
     * 4. Valida estrutura mínima de um pet
     * 5. Exibe os pets no console
     */
    const response = await request.get('/pet/findByStatus?status=pending');
    expect(response.status()).toBe(400);
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

  test('Listar pets pelo status - sold 400', async ({ request }) => {
    /**
     * @description Lista pets pelo status
     * 1. Faz GET na rota /pet/findByStatus?status=sold
     * 2. Valida status code 400
     * 3. Valida que o retorno é um array
     * 4. Valida estrutura mínima de um pet
     * 5. Exibe os pets no console
     */
    const response = await request.get('/pet/findByStatus?status=sold');
    expect(response.status()).toBe(400);
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
});

test.describe.serial('GET pelo id', () => {

  test('Criar e buscar pet pelo ID', async ({ request }) => {
    const newPet = {
      id: Date.now(), // gera um ID único
      category: { id: 1, name: "dog" },
      name: "rex",
      photoUrls: filePath,
      tags: [{ id: 1, name: "cute" }],
      status: "available"
    };
    // Cria o pet
    const createResponse = await request.post('/pet', { data: newPet });
    expect(createResponse.status()).toBe(200);
    // Busca pelo ID criado
    const response = await request.get(`/pet/${newPet.id}`);
    expect(response.status()).toBe(200);
    const pet = await response.json();
    expect(pet.id).toBe(newPet.id);
    expect(pet.name).toBe("rex");
    console.log("Pet encontrado:", pet);
});

  test('Listar pet pelo ID - id inválido', async ({ request }) => {
    /**
     * @description Lista pets pelo id inválido
     * 1. Faz GET na rota /pet/id
     * 2. Valida status code 400
     * 3. Valida mensagem de erro  
     */
    const petId = '1556A2389'; 
    const response = await request.get(`/pet/${petId}`);
    expect(response.status()).toBe(400);
    const pet = await response.json(); 
    expect(pet.message).toBe('Invalid ID supplied');
  });

  test('Listar pet pelo ID - id inexistente', async ({ request }) => {
    /**
     * @description Lista pets pelo id inexistente
     * 1. Faz GET na rota /pet/id
     * 2. Valida status code 404  
     * 3. Valida mensagem de erro  
     */
    const petId = 155; 
    const response = await request.get(`/pet/${petId}`);
    expect(response.status()).toBe(404);
    const pet = await response.json(); 
    expect(pet.message).toBe('Pet not found');
  });
  
});  