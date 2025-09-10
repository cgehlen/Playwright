import { test, expect } from '@playwright/test';
import { login, upload } from '../../util/helpers.ts';


test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
  await login(page);
});

test('Cadastro de usuário - campos obrigatórios em branco', async ({ page }) => {      
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('cadastrarUsuario').click();
    await page.getByTestId('checkbox').check();
    await expect(page.getByText('Nome é obrigatório')).toBeVisible();
    await expect(page.getByText('Email é obrigatório')).toBeVisible();
    await expect(page.getByText('Password é obrigatório')).toBeVisible();
});

test('Cadastro de usuário - nome em branco', async ({ page }) => {      
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
    await page.getByTestId('cadastrar-usuarios').click();
    await page.getByTestId('nome').click();
    await page.getByTestId('nome').fill('Teste Novo para Automação');    
    await page.getByTestId('email').click();
    await page.getByTestId('email').fill('teste12345@qa.com');
    await page.getByTestId('password').click();
    await page.getByTestId('password').fill('teste12345');
    await page.getByTestId('checkbox').check();
    await page.getByTestId('cadastrarUsuario').click();
    await expect(page.getByText('Lista dos usuários')).toBeVisible();
});

test('Cadastro de usuário - email em uso', async ({ page }) => {      
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
