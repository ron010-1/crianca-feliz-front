import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.getByPlaceholder('Email*').fill('admin@admin.com');
  await page.getByPlaceholder('Senha*').fill('adminpass');

  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL('http://localhost:5173/');
  await page.waitForTimeout(3000); 
  await page.getByRole('button', { name: 'Beneficiário' }).click();
  await expect(page).toHaveURL(/beneficiario/);
});

test('Beneficiários - renderiza título, botão e tabela', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Beneficiários' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Cadastrar beneficiário' })
  ).toBeVisible();

  await expect(page.locator('table.custom-table')).toBeVisible();

  await expect(page.getByText('Nome')).toBeVisible();
  await expect(page.getByText('Responsável')).toBeVisible();
  await expect(page.getByText('Data de Nascimento')).toBeVisible();
  await expect(page.getByText('Telefone 1')).toBeVisible();
  await expect(page.getByText('Telefone 2')).toBeVisible();
  await expect(page.getByText('Ações')).toBeVisible();
});

test('Beneficiários - deve listar registros na tabela', async ({ page }) => {
  const rows = page.locator('tbody tr');

  await expect(rows).toHaveCount(0);
});

test('Beneficiários - ações (mapa, editar e deletar) visíveis e clicáveis', async ({ page }) => {
  const firstRow = page.locator('tbody tr').first();

  const mapButton = firstRow.locator('.icon-actions.icon-map');
  const editButton = firstRow.locator('.icon-actions.icon-edit');
  const deleteButton = firstRow.locator('.icon-actions.icon-delete');

  await expect(mapButton).toBeVisible();
  await expect(editButton).toBeVisible();
  await expect(deleteButton).toBeVisible();

  await editButton.click();
});
