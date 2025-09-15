import { test, expect } from '@playwright/test';
import { login } from '../../util/helpers.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
});

test('Login - sem email', async ({ page }) => {
    /**
   * @description O teste valida o login sem informar o email.
   * 1. Abre a tela e faz login
   * 2. Preenche o campo senha e clica em entrar
   * 3. Valida mensagem "Email é obrigatório" é exibida   
   **/        
    await page.getByTestId('email').fill('');
    await page.getByTestId('senha').fill('teste');
    await page.getByTestId('entrar').click();
    await expect(page.locator('text=Email é obrigatório')).toBeVisible();
});

test('Login - sem senha', async ({ page }) => {
    /**
   * @description O teste valida o login sem informar a senha.
   * 1. Abre a tela e faz login
   * 2. Preenche o campo email e clica em entrar
   * 3. Valida mensagem "Password é obrigatório" é exibida   
   **/         
    await page.getByTestId('email').fill('fulano@qa.com');
    await page.getByTestId('senha').fill('');
    await page.getByTestId('entrar').click();
    await expect(page.locator('text=Password é obrigatório')).toBeVisible();
});      

test('Email incompleto', async ({ page }) => {
    /**
   * @description O teste valida o login com email incompleto.
   * 1. Abre a tela e faz login
   * 2. Preenche o campo email incompleto e a senha e clica em entrar
   * 3. Valida mensagem "Insira uma parte "@fulano" esta incompleta" é exibida
   **/       
    await page.getByTestId('email').fill('fulano@');
    await page.getByTestId('senha').fill('teste');
    const validationMessage = await page.locator('[data-testid="email"]').evaluate(
    (el: HTMLInputElement) => el.validationMessage );
  expect(validationMessage).toContain('Insira uma parte'); 
       
});

test('Login - sem incorreta', async ({ page }) => {
    /**
   * @description O teste valida o login com senha incorreta.
   * 1. Abre a tela e faz login
   * 2. Preenche o campo email e uma senha incorreta e clica em entrar
   * 3. Valida mensagem "Email e/ou senha inválidos" é exibida
   **/        
    await page.getByTestId('email').fill('fulano@qa.com');
    await page.getByTestId('senha').fill('teste12345');
    await page.getByTestId('entrar').click();
    await expect(page.locator('text=Email e/ou senha inválidos')).toBeVisible();
});  


test('Login com sucesso', async ({ page }) => {
    /**
   * @description O teste valida o login com sucesso.
   * 1. Abre a tela e faz login
   * 2. Preenche o campo email e a senha corretos e clica em entrar
   * 3. Valida se o menu é exibido
   **/        
    await login(page);
    await expect(page.locator('#navbarTogglerDemo01')).toBeVisible();  
       
});

test('Logout', async ({ page }) => {
    /**
   * @description O teste valida o logout com sucesso.
   * 1. Abre a tela e faz login
   * 2. Preenche o campo email e a senha corretos e clica em entrar
   * 3. Clica em logout
   * 4. Valida se a tela de login é exibida
   **/        
    await page.getByTestId('email').fill('fulano@qa.com');
    await page.getByTestId('senha').fill('teste');
    await page.getByTestId('entrar').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#navbarTogglerDemo01')).toBeVisible();
    await page.getByTestId('logout').click();
    await expect (page.getByRole('heading', { name: 'Login' })).toBeVisible();         
});
