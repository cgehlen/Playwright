import { test, expect } from '@playwright/test';
import { gerarDescricao, gerarNomeProduto, gerarPreco, gerarQuantidade, login, upload } from './helpers';


test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
  await login(page);
  await page.getByTestId('cadastrar-produtos').click();
});

test('Cadastro de produtos - campos obrigatórios em branco', async ({ page }) => {      
    await page.getByTestId('cadastarProdutos').click();
    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Preco é obrigatório')).toBeVisible();
    await expect(page.getByText('Descricao é obrigatório')).toBeVisible();
    await expect(page.getByText('Quantidade é obrigatório')).toBeVisible();
    //await expect(page.getByText('Imagem é obrigatório')).toBeVisible(); marca como obrigatorio mas nao cita na mensagem

});

test('Cadastro de produtos - nome em branco', async ({ page }) => {    
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await page.getByTestId('quantity').fill('100');  
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Nome é obrigatório')).toBeVisible();
});

test('Cadastro de produtos - preço em branco', async ({ page }) => {  
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await page.getByTestId('quantity').fill('100');  
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Preco é obrigatório')).toBeVisible();  
});

test('Cadastro de produtos - descrição em branco', async ({ page }) => {      
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('quantity').fill('100');  
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Descricao é obrigatório')).toBeVisible(); 
});

test('Cadastro de produtos - quantidade em branco', async ({ page }) => {      
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Quantidade é obrigatório')).toBeVisible();
});

test('Cadastro de produtos - cadastro com sucesso', async ({ page }) => {      
  await page.getByTestId('nome').fill(await gerarNomeProduto());
  const preco = await gerarPreco();
  await page.getByTestId('preco').fill(String(preco)); 
  await page.getByTestId('descricao').fill(await gerarDescricao());
  const quant = await gerarQuantidade();
  await page.getByTestId('quantity').fill(String(quant));
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Lista dos Produtos')).toBeVisible();
});

test('Cadastro de produtos - cadastro duplicado', async ({ page }) => {      
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await page.getByTestId('quantity').fill('100');
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Já existe produto com esse nome')).toBeVisible();
});
