import { test, expect } from '@playwright/test';
import { login } from '../../util/helpers.ts';

let token: string;
test.beforeAll(async ({ request }) => {
  // login para obter token
  const loginResponse = await request.post('/login', {
    data: {
      email: 'fulano@qa.com',
      password: 'teste'
    }
  });
  const body = await loginResponse.json();
  token = body.authorization;
});

test('Listar carrinho', async ({ request }) => {
    /**
    * @description Listas carrinhos cadastrados
    * 1. Faz get na rota /carrinhos
    * 2. Valida status code 200
    * 3. Valida que o retorno é um array
    * 4. Valida estrutura mínima de um carrinho 
    * 5. Exibe os carrinhos no console
    */          
  const response = await request.get('/carrinhos');
  expect(response.status()).toBe(200);
  const body = await response.json();  
  // consistência
  expect(Array.isArray(body.carrinhos)).toBe(true);
  // validar estrutura mínima de um produto
  if (body.carrinhos.length > 0) {
    const carrinho = body.carrinhos[0];
    expect(carrinho).toHaveProperty('_id');
    expect(carrinho).toHaveProperty('precoTotal');
    expect(carrinho).toHaveProperty('quantidadeTotal');
    expect(carrinho).toHaveProperty('idUsuario');    
  }  
  console.log("Carrinhos:", JSON.stringify(body.carrinhos, null, 2));
});

test('Cadastrar carrinho com sucesso', async ({ request }) => {
  // 1. Limpa carrinho antes do teste
  await request.delete('/carrinhos/cancelar-compra', {
    headers: { Authorization: token }
  });
  // 2. Cria carrinho novo
  const response = await request.post('/carrinhos', {
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 1 },
        { idProduto: "YaeJ455lz3k6kSIzA", quantidade: 3 }
      ]
    },
    headers: { Authorization: token }
  });
  // 3. Validações do POST
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body).toHaveProperty('_id');
  const carrinhoId = body._id;
  console.log("ID do carrinho criado:", carrinhoId);
  // 4. Valida que realmente foi criado com GET
  const getResponse = await request.get(`/carrinhos/${carrinhoId}`, {
    headers: { Authorization: token }
  });
  expect(getResponse.status()).toBe(200);
  const carrinho = await getResponse.json();
  expect(carrinho).toHaveProperty('produtos');
  expect(carrinho.produtos.length).toBeGreaterThan(0);
});


test('Cadastrar carrinho - validar que existe produto duplicado', async ({ request }) => {
  // cancelar compra antes de criar novo carrinho
  await request.delete('/carrinhos/cancelar-compra', {
    headers: { Authorization: token }
  });

  const response = await request.post('/carrinhos', {
    headers: { Authorization: token },
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 1 },
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 2 }
      ]
    }
  });
  const body = await response.json();
  const carrinhoId = body._id;
  console.log("ID do carrinho criado:", carrinhoId);
  expect(response.status()).toBe(400);
  expect(body.message).toBe('Não é permitido possuir produto duplicado');  
});

test('Cadastrar carrinho - validar que nao pode ter mais de um carrinho', async ({ request }) => {
  // 1. Cria o primeiro carrinho (deve dar certo)
  const primeiroResponse = await request.post('/carrinhos', {
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 1 }
      ]
    },
    headers: { Authorization: token }
  });
  expect(primeiroResponse.status()).toBe(201);
  const primeiroBody = await primeiroResponse.json();
  const primeiroCarrinhoId = primeiroBody._id;
  console.log("Primeiro carrinho criado:", primeiroCarrinhoId);
  // 2. Tenta criar o segundo carrinho (deve falhar)
  const segundoResponse = await request.post('/carrinhos', {
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 2 }
      ]
    },
    headers: { Authorization: token }
  });
  expect(segundoResponse.status()).toBe(400);
  const segundoBody = await segundoResponse.json();
  expect(segundoBody.message).toBe('Não é permitido ter mais de 1 carrinho');
  
});

test('Cadastrar carrinho - sem token, invalido ou inexistente', async ({ request }) => {
  const segundoResponse = await request.post('/carrinhos', {
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 2 }
      ]
    }
  });
  expect(segundoResponse.status()).toBe(401);
  const segundoBody = await segundoResponse.json();
  expect(segundoBody.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  
});