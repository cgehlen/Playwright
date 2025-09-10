import { test, expect } from '@playwright/test';
let userId: string;

test('Listar usuários', async ({ request }) => {
  const response = await request.get('/usuarios');
  expect(response.status()).toBe(200);
  const body = await response.json();
  // nível superior
  expect(body).toHaveProperty('quantidade');
  expect(body).toHaveProperty('usuarios');
  expect(Array.isArray(body.usuarios)).toBe(true);
  // consistência
  expect(body.usuarios.length).toBe(body.quantidade);
  // validar estrutura mínima de um usuário
  if (body.usuarios.length > 0) {
    const usuario = body.usuarios[0];
    expect(usuario).toHaveProperty('nome');
    expect(usuario).toHaveProperty('email');
    expect(usuario).toHaveProperty('password');
    expect(usuario).toHaveProperty('administrador');
    expect(usuario).toHaveProperty('_id');
    // validar tipos
    expect(typeof usuario.nome).toBe('string');
    expect(typeof usuario.email).toBe('string');
    expect(typeof usuario.password).toBe('string');
    expect(['true', 'false']).toContain(usuario.administrador);
    expect(typeof usuario._id).toBe('string');
  }
});

test('Cadastrar usuário com sucesso', async ({ request }) => {
  
  const response = await request.post('/usuarios', {
    data: {
      nome: "Tibicuera da Silva",
      email: "tibi@qa.com",
      password: "1234",
      administrador: "true"
    }
  });  
  expect(response.status()).toBe(201);
  const body = await response.json();
  userId = body._id;
  expect(body).toHaveProperty('_id');
  expect(body.message).toBe("Cadastro realizado com sucesso");
});

test('Usuário já cadastrado', async ({ request }) => {
  const response = await request.post('/usuarios', {
    data: {
      nome: "Fulano da Silva",
      email: "fulano@qa.com",
      password: "1234",
      administrador: "true"
    }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("Este email já está sendo usado");
});

test('Buscar usuário por ID', async ({ request }) => {
  const userId = '0uxuPY0cbmQhpEz1'; 
  const response = await request.get(`/usuarios/${userId}`);  
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('nome', 'Fulano da Silva');
});

test('Buscar usuário por ID inexistente', async ({ request }) => {
  const userId = '0uxuPY0cbmQypEb5'; // ID aleatorio
  const response = await request.get(`/usuarios/${userId}`);  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("Usuário não encontrado");
});

test('Atualizar usuário criado', async ({ request }) => {
  expect(userId).toBeTruthy(); 
  const response = await request.put(`/usuarios/${userId}`, {
    data: {
      nome: 'Usuário Atualizado'
    }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.nome).toBe('Usuário Atualizado');
});

test('Excluir usuário criado', async ({ request }) => {
  expect(userId).toBeTruthy();
  const response = await request.delete(`/usuarios/${userId}`);
  expect(response.status()).toBe(200); 
});



