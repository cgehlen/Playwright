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
    const response = await request.post('/produtos', {
      data: {
        nome,
        preco,
        descricao,
        quantidade
      },  
      headers: {
        Authorization: `Bearer ${token}`
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
    const response = await request.put(`/produtos/${prodId}`, {
      data: {
        nome: nome + " atualizado",
        preco,
        descricao,
        quantidade
      },
      headers: {
        Authorization: `Bearer ${token}`
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

  test('Excluir produto', async ({ request }) => {
    const response = await request.delete(`/produtos/${prodId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Registro excluído com sucesso');

    // validar que não existe mais
    const getResponse = await request.get(`/produtos/${prodId}`);
    expect(getResponse.status()).toBe(400);
    const bodyNotFound = await getResponse.json();
    expect(bodyNotFound.message).toBe("Produto não encontrado");
  });

});

test('Listar produtos', async ({ request }) => {
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
  const Id = 'BeeJh5lz3k6kSIzA';
  const response = await request.get(`/produtos/${Id}`);  
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message).toBe("Produto encontrado");
});

test('Buscar produto por ID inexistente', async ({ request }) => {
  const fakeId = 'idInexistente123';
  const response = await request.get(`/produtos/${fakeId}`);  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("Produto não encontrado");
});

