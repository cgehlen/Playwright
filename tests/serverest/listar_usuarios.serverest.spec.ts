import { test, expect } from '@playwright/test';
import { login, upload } from '../../util/helpers.ts';


test.beforeEach(async ({ page }) => {
  await page.goto('https://front.serverest.dev/login');
  await login(page);
});

test('Listar usuários', async ({ page }) => {      
    await page.getByTestId('listar-usuarios').click();
    await expect(page.getByText('Lista dos usuários')).toBeVisible();
});
