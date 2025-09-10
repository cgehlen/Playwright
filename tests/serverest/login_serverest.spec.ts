import { test, expect } from '@playwright/test';
import { login } from '../../util/helpers.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
});

test('Login - sem email', async ({ page }) => {      
    await page.getByTestId('email').fill('');
    await page.getByTestId('senha').fill('teste');
    await page.getByTestId('entrar').click();
    await expect(page.locator('text=Email é obrigatório')).toBeVisible();
});

test('Login - sem senha', async ({ page }) => {      
    await page.getByTestId('email').fill('fulano@qa.com');
    await page.getByTestId('senha').fill('');
    await page.getByTestId('entrar').click();
    await expect(page.locator('text=Password é obrigatório')).toBeVisible();
});      

test('Email incompleto', async ({ page }) => {      
    await page.getByTestId('email').fill('fulano@');
    await page.getByTestId('senha').fill('teste');
    const validationMessage = await page.locator('[data-testid="email"]').evaluate(
    (el: HTMLInputElement) => el.validationMessage );
  expect(validationMessage).toContain('Insira uma parte'); 
       
});

test('Login - sem incorreta', async ({ page }) => {      
    await page.getByTestId('email').fill('fulano@qa.com');
    await page.getByTestId('senha').fill('teste12345');
    await page.getByTestId('entrar').click();
    await expect(page.locator('text=Email e/ou senha inválidos')).toBeVisible();
});  


test('Login com sucesso', async ({ page }) => {      
    await login(page);
    await expect(page.locator('#navbarTogglerDemo01')).toBeVisible();  
       
});

test('Logout', async ({ page }) => {      
    await page.getByTestId('email').fill('fulano@qa.com');
    await page.getByTestId('senha').fill('teste');
    await page.getByTestId('entrar').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#navbarTogglerDemo01')).toBeVisible();
    await page.getByTestId('logout').click();
    await expect (page.getByRole('heading', { name: 'Login' })).toBeVisible();         
});
