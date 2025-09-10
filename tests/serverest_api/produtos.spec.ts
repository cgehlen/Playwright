import { test, expect } from '@playwright/test';
import { gerarDescricao, gerarNomeProduto, gerarPreco, gerarQuantidade } from '../serverest/helpers';

let prodId: string;
let nome = await gerarNomeProduto();
let preco = await gerarPreco(); 
let descricao = await gerarDescricao();
let quantidade = await gerarQuantidade();  

test.describe.serial('CRUD Produtos', () => {

  test('Cadastrar produto', async ({ request }) => {    
    const response = await request.post('/produtos', {
      data: {
        nome: nome,
        preco: preco.toString,
        descricao: descricao,
        quantidade: quantidade.toString() 
}
    });
    const body = await response.json();
    prodId = body._id; 
    console.log(prodId);
    expect(body.message).toBe('Cadastro realizado com sucesso');

    const getResponse = await request.get(`/produtos/${prodId}`);    
    console.log(getResponse);
  });

  test('Atualizar produto - altera nome', async ({ request }) => {
    console.log(prodId);
    const response = await request.put(`/produtos/${prodId}`, {
      data: {
        nome: nome,
        preco: preco.toString,
        descricao: descricao,
        quantidade: quantidade.toString()
      }  
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Este email já está sendo usado');
    
  });

  test('Atualizar peoduto - alterar nome e email', async ({ request }) => {
    const response = await request.put(`/produtos/${prodId}`, {
      data: {
        nome: "Shakira Loca",
        email: "localoca@qa.com",
        password: "1234",
        administrador: "true"
      }  
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    const getResponse = await request.get(`/produtos/${prodId}`);    
    console.log(getResponse);
  });

  test('Excluir produto', async ({ request }) => {
    const response = await request.delete(`/produtos/${prodId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Nenhum registro excluído');
  });

});

test('Listar produtos', async ({ request }) => {
  const response = await request.get('/produtos');
  expect(response.status()).toBe(200);
  const body = await response.json();
  // nível superior
  //expect(body).toHaveProperty('_id');
  //expect(body).toHaveProperty('preco');
  expect(Array.isArray(body.produtos)).toBe(true);
  // consistência
  expect(body.produtos.length).toBe(body.quantidade);
  // validar estrutura mínima de um produto
  if (body.produtos.length > 0) {
    const produto = body.produtos[0];
    expect(produto).toHaveProperty('nome');
    expect(produto).toHaveProperty('preco');
    expect(produto).toHaveProperty('descricao');
    expect(produto).toHaveProperty('quantidade');
    expect(produto).toHaveProperty('_id');
    // validar tipos
    expect(typeof produto.nome).toBe('string');
    expect(typeof produto.preco).toBe('number');
    expect(typeof produto.descricao).toBe('string');
    expect(typeof produto.quantidade).toBe('number');
    expect(typeof produto._id).toBe('string');
  }
  
  console.log(JSON.stringify(body.produtos, null, 2));
  
});

test('Produto já cadastrado', async ({ request }) => {
  const response = await request.post('/produtos', {
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

test('Buscar produto por ID', async ({ request }) => {
  const userId = '0uxuPY0cbmQhpEz1'; 
  const response = await request.get(`/produtos/${userId}`);  
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('nome', 'Fulano da Silva');
});

test('Buscar usuário por ID inexistente', async ({ request }) => {
  const userId = '0uxuPY0cbmQypEb5'; // ID aleatorio
  const response = await request.get(`/produtos/${userId}`);  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("Usuário não encontrado");
});
