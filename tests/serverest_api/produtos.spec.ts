import { test, expect } from '@playwright/test';
import { gerarDescricao, gerarNomeProduto, gerarPreco, gerarQuantidade, login, upload } from '../../util/helpers.ts';

let token: string;
let prodId: string;
let nome: string;
let preco: number;
let descricao: string;
let quantidade: number;

test.beforeAll(async ({ request }) => {
  // gerar dados fake
  nome = await gerarNomeProduto();
  preco = await gerarPreco();
  descricao = await gerarDescricao();
  quantidade = await gerarQuantidade();
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

test.describe.serial('CRUD Produtos', () => {

  test('Cadastrar produto', async ({ request }) => {
    /**
    * @description Cadastrar produtos
    * 1. Faz post na rota /produtos
    * 2. Valida status code 200
    * 3. Valida que o produto foi criado com sucesso
    */    
    const response = await request.post('/produtos', {
      data: {
        nome,
        preco,
        descricao,
        quantidade
      },  
      headers: {
        Authorization: token
      }   
    });    

    const body = await response.json();
    prodId = body._id; 
    console.log("ID do produto criado:", prodId);
    expect(response.status()).toBe(201);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    // validar que realmente foi criado
    const getResponse = await request.get(`/produtos/${prodId}`);
    expect(getResponse.status()).toBe(200);
  });

  test('Atualizar produto', async ({ request }) => {
    /**
    * @description Editar produtos
    * 1. Faz put na rota /produtos
    * 2. Valida status code 200
    * 3. Valida que o produto foi editado com sucesso
    */ 
    const response = await request.put(`/produtos/${prodId}`, {
      data: {
        nome: nome + " atualizado",
        preco,
        descricao,
        quantidade
      },
      headers: {
        Authorization: token
      } 
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Registro alterado com sucesso');
    // confirmar alteração
    const getResponse = await request.get(`/produtos/${prodId}`);
    const produto = await getResponse.json();
    expect(produto.nome).toBe(nome + " atualizado");
  });

  test('Não deve permitir cadastrar produto duplicado', async ({ request }) => {
    /**
    * @description Valida se deixa cadastrar produtos duplicados
    * 1. Faz post na rota /produtos de um produto
    * 2. faz post na rota /produtos do mesmo produto
    * 3. Valida status code 400 
    * 4. Valida a mensagem de erro
    */      
    await request.post('/produtos', {
      data: { nome: "Produto QA", preco: 10, descricao: "teste", quantidade: 5 },
      headers: { Authorization: token }
    });
    const response = await request.post('/produtos', {
      data: { nome: "Produto QA", preco: 20, descricao: "duplicado", quantidade: 2 },
      headers: { Authorization: token }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Já existe produto com esse nome');
  });

  test('Não deve permitir cadastrar produto sem token', async ({ request }) => {
    /**
    * @description Valida se deixa cadastrar produtos sem token
    * 1. Faz post na rota /produtos de um produto sem token
    * 2. Valida status code 401
    * 3 . Valida a mensagem de erro
    */ 
    const response = await request.post('/produtos', {
      data: { nome: "Sem token", preco: 30, descricao: "teste", quantidade: 1 }
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });

  test('Não deve permitir cadastrar produto se não for admin', async ({ request }) => { 
    /**
    * @description Valida se deixa cadastrar produtos sem ser admin
    * 1. Faz post na rota /produtos com token de usuário comum
    * 2. Valida status code 403
    * 3. Valida a mensagem de erro
    */    
    const loginResponse = await request.post('/login', {
      data: { email: 'naoadmin@qa.com', password: 'teste' }
    });
    const loginBody = await loginResponse.json();
    const tokenComum = loginBody.authorization;
    const response = await request.post('/produtos', {
      data: { nome: "Produto comum", preco: 15, descricao: "teste", quantidade: 2 },
      headers: { Authorization: tokenComum }
    });
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.message).toBe('Rota exclusiva para administradores');
  });

  test('Excluir produto com sucesso', async ({ request }) => {
    /**
    * @description Excluir produtos
    * 1. Faz delete na rota /produtos com o id do produto
    * 2. Valida status code 200
    * 3. Valida que o produto foi excluido com sucesso
    */ 
    const response = await request.delete(`/produtos/${prodId}`, {
      headers: {
        Authorization: token
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe("Registro excluído com sucesso | Nenhum registro excluído");
    // validar que não existe mais
    const getResponse = await request.get(`/produtos/${prodId}`);
    expect(getResponse.status()).toBe(400);
    const bodyNotFound = await getResponse.json();
    expect(bodyNotFound.message).toBe("Produto não encontrado");
  });

  test('Excluir produto que faz parte de carrinho', async ({ request }) => {
    /**
    * @description Excluir produtos
    * 1. Faz delete na rota /produtos de um produto que faz parte de um carrinho
    * 2. Valida status code 400
    * 3. Valida a mensagem de erro
    */ 
    const novoResponse = await request.post('/produtos', {
    data: { nome: "ProdutoCarrinho", preco: 50, descricao: "teste", quantidade: 3 },
    headers: { Authorization: token }
    });
    const novoBody = await novoResponse.json();
    const novoProdId = novoBody._id;    
    await request.post('/carrinhos', {
      data: {
        produtos: [{ idProduto: novoProdId, quantidade: 1 }]
      },
      headers: { Authorization: token }
    });
    const response = await request.delete(`/produtos/${novoProdId}`, {
      headers: { Authorization: token }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain("Não é permitido excluir produto que faz parte de carrinho");
    expect(body).toHaveProperty("idCarrinho");
  });

});

test('Listar produtos', async ({ request }) => {
  /**
    * @description Listar produtos
    * 1. Faz get na rota /produtos
    * 2. Valida status code 200
    * 3. Lista os produtos
    */ 
  const response = await request.get('/produtos');
  expect(response.status()).toBe(200);
  const body = await response.json();  
  // consistência
  expect(Array.isArray(body.produtos)).toBe(true);
  expect(body.produtos.length).toBe(body.quantidade);
  // validar estrutura mínima de um produto
  if (body.produtos.length > 0) {
    const produto = body.produtos[0];
    expect(produto).toHaveProperty('nome');
    expect(produto).toHaveProperty('preco');
    expect(produto).toHaveProperty('descricao');
    expect(produto).toHaveProperty('quantidade');
    expect(produto).toHaveProperty('_id');
  }  
  console.log("Produtos:", JSON.stringify(body.produtos, null, 2));
});

test('Buscar produto por ID ', async ({ request }) => {
  /**
    * @description Lista produto por id
    * 1. Faz get na rota /produtos
    * 2. Valida status code 200
    * 3. Valida que o produto foi encontrado com sucesso
      */ 
    const id = 'BeeJh5lz3k6kSIzA'; 
    const response = await request.get(`/produtos/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    // validar propriedades
    expect(body).toHaveProperty('_id', id);
    expect(body).toHaveProperty('nome');
    expect(body).toHaveProperty('preco');
    expect(body).toHaveProperty('descricao');
    expect(body).toHaveProperty('quantidade');
    // validar tipos
    expect(typeof body.nome).toBe('string');
    expect(typeof body.preco).toBe('number');
    expect(typeof body.descricao).toBe('string');
    expect(typeof body.quantidade).toBe('number');
    expect(typeof body._id).toBe('string');
});

test('Buscar produto por ID inexistente', async ({ request }) => {
  /**
    * @description Lista produtos - id inexistente para validar a mensagem de erro
    * 1. Faz get na rota /produtos
    * 2. Valida status code 200
    * 3. Valida que o produto foi editado com sucesso
    */ 
  const fakeId = 'idInexistente123';
  const response = await request.get(`/produtos/${fakeId}`);  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("Produto não encontrado");
});

