import { test, expect } from '@playwright/test';
import { gerarDescricao, gerarNomeProduto, gerarPreco, gerarQuantidade, login, upload } from '../../util/helpers.ts';


test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
  await login(page);
  await page.getByTestId('cadastrar-produtos').click();
});

test('Cadastro de produtos - campos obrigatórios em branco', async ({ page }) => {
  /**
   * @description O teste valida os campos obrigátorios no cadastro de produtos..
   * 1. Abre a tela e faz login
   * 2. Deixa os campos vazios e clica em cadastrar
   * 3. Valida mensagem "Nome é obrigatório"  
   * 4. Valida mensagem "Preço é obrigatório"
   * 5. Valida mensagem "Descrição é obrigatório"
   * 6. Valida mensagem "Quantidade é obrigatório"
   **/      
    await page.getByTestId('cadastarProdutos').click();
    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Preco é obrigatório')).toBeVisible();
    await expect(page.getByText('Descricao é obrigatório')).toBeVisible();
    await expect(page.getByText('Quantidade é obrigatório')).toBeVisible();
    //await expect(page.getByText('Imagem é obrigatório')).toBeVisible(); marca como obrigatorio mas nao cita na mensagem

});

test('Cadastro de produtos - nome em branco', async ({ page }) => { 
  /**
   * @description O teste valida se o campo nome é obrigatório no cadastro de produtos.
   * 1. Abre a tela e faz login
   * 2. Deixa o campo nome vazio e clica em cadastrar
   * 3. Valida mensagem "Nome é obrigatório"
  **/     
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await page.getByTestId('quantity').fill('100');  
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Nome é obrigatório')).toBeVisible();
});

test('Cadastro de produtos - preço em branco', async ({ page }) => {  
  /**
   * @description O teste valida se o campo preço é obrigatório no cadastro de produtos.
   * 1. Abre a tela e faz login
   * 2. Deixa o campo preço vazio e clica em cadastrar
   * 3. Valida mensagem "Preço é obrigatório"
  **/ 
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await page.getByTestId('quantity').fill('100');  
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Preco é obrigatório')).toBeVisible();  
});

test('Cadastro de produtos - descrição em branco', async ({ page }) => { 
  /**
   * @description O teste valida se o campo descrição é obrigatório no cadastro de produtos.
   * 1. Abre a tela e faz login
   * 2. Deixa o campo nome descrição e clica em cadastrar
   * 3. Valida mensagem "Decrição é obrigatório"
  **/      
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('quantity').fill('100');  
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Descricao é obrigatório')).toBeVisible(); 
});

test('Cadastro de produtos - quantidade em branco', async ({ page }) => {
  /**
   * @description O teste valida se o campo quantidade é obrigatório no cadastro de produtos.
   * 1. Abre a tela e faz login
   * 2. Deixa o campo nome quantidade e clica em cadastrar
   * 3. Valida mensagem "Quantidade é obrigatório"
  **/       
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Quantidade é obrigatório')).toBeVisible();
});

test('Cadastro de produtos - cadastro com sucesso', async ({ page }) => {
  /**
   * @description Realiza o cadastro de um produto com sucesso.
   * 1. Abre a tela e faz login
   * 2. Preenche os campos e clica em cadastrar
   * 3. Valida se exibie a "Lista dos Produtos"
  **/       
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
  /**
   * @description O teste valida o cadastro de um produto já existente.
   * 1. Abre a tela e faz login
   * 2. Preenche os campos com um produto já cadastrado e clica em cadastrar
   * 3. Valida mensagem "Já existe produto com esse nome" é exibida
  **/       
  await page.getByTestId('nome').fill('Produto novo');
  await page.getByTestId('preco').fill('199');
  await page.getByTestId('descricao').fill('Produto novo para testes de automação');
  await page.getByTestId('quantity').fill('100');
  await upload(page); 
  await page.getByTestId('cadastarProdutos').scrollIntoViewIfNeeded();
  await page.getByTestId('cadastarProdutos').click();
  await expect(page.getByText('Já existe produto com esse nome')).toBeVisible();
});
