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
  * @description Lista carrinhos cadastrados - cada usuário pode ter no máximo 1 carrinho
  * 1. Faz get na rota /carrinhos
  * 2. Valida status code 200
  * 3. Valida que o retorno é um array
  * 4. Valida que há no máximo 1 carrinho no array
  * 5. Se existir, valida estrutura mínima
  * 6. Exibe os carrinhos no console
  */          
  const response = await request.get('/carrinhos');
  expect(response.status()).toBe(200);
  const body = await response.json();
  // consistência
  expect(Array.isArray(body.carrinhos)).toBe(true);
  expect(body.carrinhos.length).toBeLessThanOrEqual(1);
  // validar estrutura mínima de um carrinho se existir
  if (body.carrinhos.length === 1) {
    const carrinho = body.carrinhos[0];
    expect(carrinho).toHaveProperty('_id');
    expect(carrinho).toHaveProperty('precoTotal');
    expect(carrinho).toHaveProperty('quantidadeTotal');
    expect(carrinho).toHaveProperty('idUsuario');
  }
  console.log("Carrinhos:", JSON.stringify(body.carrinhos, null, 2));
});

test('Cadastrar carrinho com sucesso', async ({ request }) => {
  await request.delete('/carrinhos/cancelar-compra', {
    headers: { Authorization: token }
  });

  const response = await request.post('/carrinhos', {
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 1 },
        { idProduto: "YaeJ455lz3k6kSIzA", quantidade: 3 }
      ]
    },
    headers: { Authorization: token }
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body).toHaveProperty('_id');

  // garante que só tem 1 carrinho
  const getResponse = await request.get('/carrinhos', {
    headers: { Authorization: token }
  });
  const getBody = await getResponse.json();
  expect(getBody.carrinhos.length).toBe(1);
});

test('Cadastrar carrinho - validar que existe produto duplicado', async ({ request }) => {
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

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe('Não é permitido possuir produto duplicado');
});

test('Cadastrar carrinho - validar que não pode ter mais de um carrinho', async ({ request }) => {
  // cria primeiro carrinho
  const primeiroResponse = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: "BeeJh5lz3k6kSIzA", quantidade: 1 }] },
    headers: { Authorization: token }
  });
  expect(primeiroResponse.status()).toBe(201);

  // tenta criar segundo carrinho
  const segundoResponse = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: "BeeJh5lz3k6kSIzA", quantidade: 2 }] },
    headers: { Authorization: token }
  });
  expect(segundoResponse.status()).toBe(400);

  const segundoBody = await segundoResponse.json();
  expect(segundoBody.message).toBe('Não é permitido ter mais de 1 carrinho');
});

test('Cadastrar carrinho - sem token, inválido ou inexistente', async ({ request }) => {
  const response = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: "BeeJh5lz3k6kSIzA", quantidade: 2 }] }
  });

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
});


test('Listar carrinho com id - não encontrado', async ({ request }) => {
    /**
    * @description Lista carrinho com id 
    * 1. Faz get na rota /carrinhos/id
    * 2. Valida status code 400
    * 3. Deveria validar a mensagem de erro, mas a API está retornando mensagem genérica
    * 4. Exibe o retorno no console
    * Obs: O id do carrinho deve ter exatamente 16 caracteres alfanuméricos, caso contrário retorna erro 400.
    */
  const idCarrinho = 'qbMqntef4iTOwWfg';     
  const response = await request.get(`/carrinhos/{'${idCarrinho}'}`);
  expect(response.status()).toBe(400);
  const body = await response.json();
  //console.log("Response:", body);//{ id: 'id deve ter exatamente 16 caracteres alfanuméricos' }
  expect(body.message).toBe('Carrinho não encontrado');
});

test('Cadastrar carrinho - validar que nao pode ter mais de um carrinho', async ({ request }) => {
  //O carrinho é vinculado ao usuário do token enviado no header Authorization, sendo possível cadastrar apenas 1 carrinho por usuário.
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

async function getProduto(request, produtoId: string) {
  const response = await request.get(`/produtos/${produtoId}`);
  expect(response.status()).toBe(200);
  const body = await response.json();
  return body;
}

async function criarCarrinho(request, produtoId: string, quantidade: number, token: string) {
  const response = await request.post('/carrinhos', {
    headers: { Authorization: token },
    data: {
      produtos: [
        {
          idProduto: produtoId,
          quantidade
        }
      ]
    }
  });
  expect(response.status()).toBe(201);
  return response.json();
}

async function cancelarCarrinho(request, token: string) {
  const response = await request.delete('/carrinhos/cancelar-compra', {
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(200);
  return response.json();
}

test('Cancelar carrinho deve reabastecer estoque', async ({ request }) => { 
  
  const produtoId = 'BeeJh5lz3k6kSIzA'; 
  const quantidadeCarrinho = 1;
  // 1. Pegar estoque inicial
  const produtoAntes = await getProduto(request, produtoId);
  const estoqueInicial = produtoAntes.quantidade;
  // 2. Criar carrinho
  await criarCarrinho(request, produtoId, quantidadeCarrinho, token);
  // 3. Verificar se estoque diminuiu
  const produtoDepoisCarrinho = await getProduto(request, produtoId);
  expect(produtoDepoisCarrinho.quantidade).toBe(estoqueInicial - quantidadeCarrinho);
  // 4. Cancelar carrinho
  await cancelarCarrinho(request, token);
  // 5. Verificar se estoque voltou ao original
  const produtoDepoisCancelamento = await getProduto(request, produtoId);
  expect(produtoDepoisCancelamento.quantidade).toBe(estoqueInicial);
});
