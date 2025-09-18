import { test, expect } from '@playwright/test';
import { gerarEmail, gerarNomeUsuario, login, upload } from '../../util/helpers.ts';


test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
  await login(page);
});

test('Cadastro de usuário - campos obrigatórios em branco', async ({ page }) => {
    /**
   * @description O teste valida os campos obrigátorios no cadastro de usuários.
   * 1. Abre a tela e faz login
   * 2. Deixa os campos vazios e clica em cadastrar
   * 3. Valida mensagem "Nome é obrigatório"  
   * 4. Valida mensagem "Email é obrigatório"
   * 5. Valida mensagem "Password é obrigatório"
   **/            
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('cadastrarUsuario').click();
    await page.getByTestId('checkbox').check();
    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Email é obrigatório')).toBeVisible();
    await expect(page.getByText('Password é obrigatório')).toBeVisible();
});

test('Cadastro de usuário - nome em branco', async ({ page }) => {
    /**
   * @description O teste valida se o campo nome é obrigatório no cadastro de usuários.
   * 1. Abre a tela e faz login
   * 2. Deixa o campo nome vazio e clica em cadastrar
   * 3. Valida mensagem "Nome é obrigatório"  
   **/         
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('email').click();
    await page.getByTestId('email').fill('teste12345@qa.com');
    await page.getByTestId('password').click();
    await page.getByTestId('password').fill('teste12345');
    await page.getByTestId('checkbox').check();
    await page.getByTestId('cadastrarUsuario').click();
    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    
});

test('Cadastro de usuário - e-mail em branco', async ({ page }) => {
    /**
   * @description O teste valida se o campo email é obrigatório no cadastro de usuários.
   * 1. Abre a tela e faz login
   * 2. Deixa o campo email vazio e clica em cadastrar
   * 3. Valida mensagem "Email é obrigatório"  
   **/      
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('nome').click();
    await page.getByTestId('nome').fill('Teste Novo para Automação');    
    await page.getByTestId('password').click();
    await page.getByTestId('password').fill('teste12345');
    await page.getByTestId('checkbox').check();
    await page.getByTestId('cadastrarUsuario').click();
    await expect(page.getByText('Email é obrigatório')).toBeVisible();  
});

test('Cadastro de usuário - senha em branco', async ({ page }) => {
    /**
   * @description O teste valida se o campo senha é obrigatório no cadastro de usuários.
   * 1. Abre a tela e faz login
   * 2. Deixa o campo senha vazio e clica em cadastrar
   * 3. Valida mensagem "Password é obrigatório"  
   **/       
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('nome').click();
    await page.getByTestId('nome').fill('Teste Novo para Automação');    
    await page.getByTestId('email').click();
    await page.getByTestId('email').fill('teste12345@qa.com');
    await page.getByTestId('password').click();
    await page.getByTestId('checkbox').check();
    await page.getByTestId('cadastrarUsuario').click();
    await expect(page.getByText('Password é obrigatório')).toBeVisible();
});

test('Cadastro de usuário - cadastro com sucesso', async ({ page }) => {
    /**
   * @description O teste realiza o cadastro de um usuário com sucesso.
   * 1. Abre a tela e faz login
   * 2. Preenche os campos e clica em cadastrar
   * 3. Valida se exibie a "Lista dos usuários"
   **/
    const nome = await gerarNomeUsuario();
    const email = await gerarEmail();  
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('nome').click();
    await page.getByTestId('nome').fill(nome);    
    await page.getByTestId('email').click();
    await page.getByTestId('email').fill(`${email}@qa.com`);
    await page.getByTestId('password').click();
    await page.getByTestId('password').fill('teste12345');
    await page.getByTestId('checkbox').check();
    await page.getByTestId('cadastrarUsuario').click();
    await expect(page.getByText('Lista dos usuários')).toBeVisible();
});

test('Cadastro de usuário - email em uso', async ({ page }) => {
    /**
   * @description O teste valida o cadastro de um usuário com email já existente.
   * 1. Abre a tela e faz login
   * 2. Preenche os campos com um email já cadastrado e clica em cadastrar
   * 3. Valida mensagem "Este email já está sendo usado" é exibida   
   **/       
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('nome').click();
    await page.getByTestId('nome').fill('Teste Novo para Automação');    
    await page.getByTestId('email').click();
    await page.getByTestId('email').fill('teste12345@qa.com');
    await page.getByTestId('password').click();
    await page.getByTestId('password').fill('teste12345');
    await page.getByTestId('checkbox').check();
    await page.getByTestId('cadastrarUsuario').click();
    await expect(page.getByText('Este email já está sendo usado')).toBeVisible();
});
