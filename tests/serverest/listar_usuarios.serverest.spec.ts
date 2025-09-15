import { test, expect } from '@playwright/test';
import { login, upload } from '../../util/helpers.ts';


test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
  await login(page);
});

test('Listar usuários', async ({ page }) => {
  /**
   * @description O teste valida a listagem de usuários.
   * 1. Abre a tela e faz login
   * 2. Clica em listar usuários
   * 3. Valida se exibie a "Lista dos usuários"
   **/        
    await page.getByTestId('listar-usuarios').click();
    await expect(page.getByText('Lista dos usuários')).toBeVisible();
});
