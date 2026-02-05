import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.getByPlaceholder('Email*').fill('admin@admin.com');
  await page.getByPlaceholder('Senha*').fill('adminpass');

  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForTimeout(3000); 
  await expect(page).toHaveURL('http://localhost:5173/');
});

test('Menu - deve renderizar todos os itens', async ({ page }) => {
  await expect(page.getByAltText('Logo')).toBeVisible();
  await expect(page.getByText('SIGPCF')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Inicio' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Assistente' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Beneficiário' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Visitas' })).toBeVisible();
});

test('Menu - navegação entre páginas', async ({ page }) => {
  await page.getByRole('button', { name: 'Assistente' }).click();
  await expect(page).toHaveURL(/assistente/);

  await page.getByRole('button', { name: 'Beneficiário' }).click();
  await expect(page).toHaveURL(/beneficiario/);

  await page.getByRole('button', { name: 'Visitas' }).click();
  await expect(page).toHaveURL(/visitas/);
});
