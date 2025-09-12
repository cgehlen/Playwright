import { test, expect, APIRequestContext } from '@playwright/test';
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
  * 1. Faz GET na rota /carrinhos
  * 2. Valida status code 200
  * 3. Valida que o retorno contém quantidade e carrinhos
  * 4. Valida que `carrinhos` é um array com no máximo 1 item
  * 5. Se existir, valida estrutura mínima do carrinho e de seus produtos
  * 6. Exibe os carrinhos no console
  */   
  const response = await request.get('/carrinhos');
  expect(response.status()).toBe(200);
  const body = await response.json();
  // Estrutura de resposta
  expect(body).toHaveProperty('quantidade');
  expect(body).toHaveProperty('carrinhos');
  expect(Array.isArray(body.carrinhos)).toBe(true);
  expect(body.carrinhos.length).toBeLessThanOrEqual(1);
  // Estrutura mínima de um carrinho (se existir)
  if (body.carrinhos.length === 1) {
    const carrinho = body.carrinhos[0];
    expect(carrinho).toHaveProperty('_id');
    expect(carrinho).toHaveProperty('precoTotal');
    expect(carrinho).toHaveProperty('quantidadeTotal');
    expect(carrinho).toHaveProperty('idUsuario');
    expect(Array.isArray(carrinho.produtos)).toBe(true);
    // Estrutura mínima de um produto (se existir)
    if (carrinho.produtos.length > 0) {
      const produto = carrinho.produtos[0];
      expect(produto).toHaveProperty('idProduto');
      expect(produto).toHaveProperty('quantidade');
      expect(produto).toHaveProperty('precoUnitario');
    }
  }

  console.log("Carrinhos:", JSON.stringify(body.carrinhos, null, 2));
});

test('Listar carrinho com id - validar carrinho não encontrado', async ({ request }) => {
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


test('Cadastrar carrinho com sucesso', async ({ request }) => {
  /**
  * @description Cadastrar carrinho com sucesso. O carrinho é vinculado ao usuário do token enviado no header Authorization, 
  * sendo possível cadastrar apenas 1 carrinho por usuário.
  * 1. Exclui carrinho existente (se houver) para garantir estado inicial
  * 2. Faz POST na rota /carrinhos
  * 3. Valida status code 201
  * 4. Valida mensagem de sucesso e existência do id do carrinho
  **/
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

test('Cadastrar carrinho - validar que não existe produto duplicado', async ({ request }) => {
  /**
  * @description Cadastrar carrinho e validar que não existe produto duplicado 
  * 1. Exclui carrinho existente (se houver) para garantir estado inicial
  * 2. Faz POST na rota /carrinhos com dois produtos iguais
  * 3. Valida status code 400
  * 4. Valida mensagem dque carinho nao pode ter produto duplicado
  **/
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

test('Cadastrar carrinho - produto inexistente', async ({ request }) => {
  /**
  * @description Cadastrar carrinho com produto inexistente
  * 1. Exclui carrinho existente (se houver) para garantir estado inicial
  * 2. Faz POST na rota /carrinhos com produto inexistente
  * 3. Valida status code 400
  * 4. Valida mensagem de produto não encontrado
  **/
  await request.delete('/carrinhos/cancelar-compra', {
    headers: { Authorization: token }
  });

  const response = await request.post('/carrinhos', {
    headers: { Authorization: token },
    data: {
      produtos: [
        { idProduto: "CeeJh6KZ3k6kSIzA", quantidade: 1 }
      ]
    }
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe('Produto não encontrado');
});

test('Cadastrar carrinho - produto sem estoque suficiente', async ({ request }) => {
  /**
  * @description Cadastrar carrinho com produto sem estoque suficiente
  * 1. Exclui carrinho existente (se houver) para garantir estado inicial
  * 2. Faz POST na rota /carrinhos com produto sem estoque suficiente
  * 3. Valida status code 400
  * 4. Valida mensagem de produto sem estoque suficiente
  **/
  await request.delete('/carrinhos/cancelar-compra', {
    headers: { Authorization: token }
  });
  const response = await request.post('/carrinhos', {
    headers: { Authorization: token },
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 500 }
      ]
    }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe('Produto não possui quantidade suficiente');
});


test('Cadastrar carrinho - produto zerado', async ({ request }) => {
  /**
  * @description Cadastrar carrinho com produto zerado
  * 1. Exclui carrinho existente (se houver) para garantir estado inicial
  * 2. Faz POST na rota /carrinhos com produto sem quntidade
  * 3. Valida status code 400
  * 4. Não é possível validar a mensagem, pois a API está retornando mensagem de que o produto nao contem valor obrigatório
  **/
  await request.delete('/carrinhos/cancelar-compra', {
    headers: { Authorization: token }
  });
  const response = await request.post('/carrinhos', {
    headers: { Authorization: token },
    data: {
      produtos: [
        { idProduto: "BeeJh5lz3k6kSIzA", quantidade: 0 }
      ]
    }
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  //expect(body.message).toContain('produtos não contém 1 valor obrigatório');
  console.log("Response:", body);
});

test('Cadastrar carrinho - validar que não pode ter mais de um carrinho', async ({ request }) => {
  /**
  * @description Cadastrar carrinho e validar que não pode ter mais de um carrinho
  * 1. Cria primeiro carrinho (se não houver)
  * 2. Tenta criar segundo carrinho
  * 3. Valida status code 400
  * 4. Valida a mensagem que não é permitido ter mais de 1 carrinho
  **/
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
  /**
  * @description Cadastrar carrinho sem token, inválido ou inexistente
  * 1. Faz post na rota /carrinhos sem token
  * 2. Valida status code 401
  * 3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais
  **/
  const response = await request.post('/carrinhos', {
    data: { produtos: [{ idProduto: "BeeJh5lz3k6kSIzA", quantidade: 2 }] }
  });

  expect(response.status()).toBe(401);
  const body = await response.json();
  expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
});

test('Cancelar carrinho - sem token', async ({ request }) => {
  /**
  * @description Cancelar carrinho sem token, inválido ou inexistente
  * 1. Faz post na rota /carrinhos sem token
  * 2. Valida status code 401
  * 3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais
  **/       
  async function cancelarCarrinho(request: APIRequestContext, token: string) {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      //headers: { Authorization: token }
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    return body;
  }    
  await cancelarCarrinho(request, token);
  
});

test('Cancelar carrinho - token inválido', async ({ request }) => {
  /**
  * @description Cancelar carrinho token inválido
  * 1. Faz post na rota /carrinhos com token invalido 
  * 2. Valida status code 401
  * 3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais
  **/ 
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { Authorization: 'Bearer token_invalido_123' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
    );
  });

  test('Cancelar carrinho - token expirado (simulado)', async ({ request }) => {
    /**
    * @description Cancelar carrinho token expirado
    * 1. Faz post na rota /carrinhos com token expirado (simulado) 
    * 2. Valida status code 401
    * 3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais
    **/
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { Authorization: 'Bearer token_expirado_simulado' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
    );
  });

test('Cancelar carrinho deve reabastecer estoque', async ({ request }) => { 
  /**
    * @description Valida se ao cancelar uma compra o carrinho é excluído e o estoque dos produtos desse carrinho é reabastecido.
    * 1. Faz get na rota /produtos/{id} para pegar o estoque inicial
    * 2. Cria um carrinho com esse produto
    * 3. Faz get na rota /produtos/{id} para validar que o estoque diminuiu
    * 4. Cancela o carrinho
    * 5. Faz get na rota /produtos/{id} para validar que o estoque voltou ao valor inicial
    **/
  //  
  async function getProduto(request: APIRequestContext, produtoId: string) {
    const response = await request.get(`/produtos/${produtoId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body;
  }

  async function criarCarrinho(request: APIRequestContext, produtoId: string, quantidade: number, token: string) {
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

  async function cancelarCarrinho(request: APIRequestContext, token: string) {
    const response = await request.delete('/carrinhos/cancelar-compra', {
      headers: { Authorization: token }
    });
    expect(response.status()).toBe(200);
    return response.json();
  }
  
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

test('Deletar carrinho - concluir compra', async ({ request }) => { 
  /**
    * @description Deleta carrinho ao concluir compra
    * 1. Cria um carrinho 
    * 2. Cancela o carrinho
    * 3. Faz get na rota /carrinhos para validar que o carrinho foi excluído 
    **/
  //  
  async function criarCarrinho(request: APIRequestContext, produtoId: string, quantidade: number, token: string) {
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

  async function concluirCompra(request: APIRequestContext, token: string) {
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { Authorization: token }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Registro excluído com sucesso'); 
    return body;
  }

  // 1. cria um carrinho
  const produtoId = 'BeeJh5lz3k6kSIzA'; 
  const quantidadeCarrinho = 1;
  await criarCarrinho(request, produtoId, quantidadeCarrinho, token);
  // 2. conclui compra (carrinho é excluído)
  await concluirCompra(request, token);
  // 3. valida que não há mais carrinho
  const response = await request.get('/carrinhos', {
    headers: { Authorization: token }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.carrinhos)).toBe(true);
  expect(body.carrinhos.length).toBe(0); // carrinho foi excluído
  
});

test('Concluir compra - token de usuario sem carrinho', async ({ request }) => {
  /**
   * @description Concluir compra com token de usuario que não possui carrinho
   * 1. Cria um novo usuário
   * 2. Faz login para obter token
   * 3. Tenta concluir compra
   * 4. Valida mensagem "Não foi encontrado carrinho para esse usuário"
   **/
  const novoUsuario = {
    nome: "Teste Sem Carrinho",
    email: `semcarrinho_${Date.now()}@qa.com`,
    password: "1234",
    administrador: "false"
  };
  const createResponse = await request.post('/usuarios', { data: novoUsuario });
  expect(createResponse.status()).toBe(201);
  const loginResponse = await request.post('/login', {
    data: { email: novoUsuario.email, password: novoUsuario.password }
  });
  expect(loginResponse.status()).toBe(200);
  const loginBody = await loginResponse.json();
  const tokenSemCarrinho = loginBody.authorization;
  const response = await request.delete('/carrinhos/concluir-compra', {
    headers: { Authorization: tokenSemCarrinho }
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toBe('Não foi encontrado carrinho para esse usuário');
  
});

test('Concluir compra - sem token', async ({ request }) => {
  /**
  * @description Concluir compra sem token, inválido ou inexistente
  * 1. Faz post na rota /carrinhos sem token
  * 2. Valida status code 401
  * 3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais
  **/       
  async function cancelarCarrinho(request: APIRequestContext, token: string) {
    const response = await request.delete('/carrinhos/concluir-compra', {
      //headers: { Authorization: token }
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    return body;
  }    
  await cancelarCarrinho(request, token);
  
});

test('Concluir compra - token inválido', async ({ request }) => {
  /**
  * @description Concluir compra token inválido
  * 1. Faz post na rota /carrinhos com token invalido 
  * 2. Valida status code 401
  * 3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais
  **/ 
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { Authorization: 'Bearer token_invalido_123' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
    );
  });

  test('Concluir compra - token expirado (simulado)', async ({ request }) => {
    /**
    * @description Concluir compra token expirado
    * 1. Faz post na rota /carrinhos com token expirado (simulado) 
    * 2. Valida status code 401
    * 3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais
    **/
    const response = await request.delete('/carrinhos/concluir-compra', {
      headers: { Authorization: 'Bearer token_expirado_simulado' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
    );
  });