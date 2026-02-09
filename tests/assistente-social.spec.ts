import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.getByPlaceholder('Email*').fill('admin@admin.com');
  await page.getByPlaceholder('Senha*').fill('adminpass');

  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL('http://localhost:5173/');
  await page.waitForTimeout(3000); 
  await page.getByRole('button', { name: 'Assistente' }).click();
  await expect(page).toHaveURL(/assistente/);
});

test('Assistentes - renderiza título, botão e tabela', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Assistentes Sociais' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Novo Assistente' })
  ).toBeVisible();

  await expect(page.locator('table.custom-table')).toBeVisible();

  await expect(page.getByText('Nome')).toBeVisible();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByText('Telefone')).toBeVisible();
  await expect(page.getByText('Ações')).toBeVisible();
});

test('Assistentes - lista deve conter registros', async ({ page }) => {
  const rows = page.locator('tbody tr');

  await expect(rows).toHaveCount(0);
});

test('Assistentes - ação editar pelo class', async ({ page }) => {
  const firstRow = page.locator('tbody tr').first();

  const editButton = firstRow.locator('.icon-actions.icon-edit');

  await expect(editButton).toBeVisible();

  await editButton.click();
});

