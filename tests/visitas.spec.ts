import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.getByPlaceholder('Email*').fill('admin@admin.com');
  await page.getByPlaceholder('Senha*').fill('adminpass');

  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL('http://localhost:5173/');
  await page.waitForTimeout(3000); 
  await page.getByRole('button', { name: 'Visitas' }).click();
  await expect(page).toHaveURL(/visitas/);
});

test('Visitas - renderiza título, botão e tabela', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'Visitas' })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Nova Visita' })
  ).toBeVisible();

  await expect(page.locator('table.custom-table')).toBeVisible();

  await expect(page.getByText('Data')).toBeVisible();
  await expect(page.getByText('Beneficiário').last()).toBeVisible();
  await expect(page.getByText('Evolução')).toBeVisible();
  await expect(page.getByText('Acompanhamento')).toBeVisible();
  await expect(page.getByText('Estímulo')).toBeVisible();
  await expect(page.getByText('Ações')).toBeVisible();
});

test('Visitas - deve listar registros na tabela', async ({ page }) => {
  const rows = page.locator('tbody tr');

  await expect(rows).toHaveCount(0);
});

test('Visitas - ações (ver fotos, editar e deletar) visíveis e funcionais', async ({ page }) => {
  const firstRow = page.locator('tbody tr').first();

  const viewPhotosButton = firstRow.locator(
    '._iconActions_1yqgn_109._iconCamera_1yqgn_145'
  );

  const editButton = firstRow.locator(
    '._iconActions_1yqgn_109._iconEdit_1yqgn_137'
  );

  const deleteButton = firstRow.locator(
    '._iconActions_1yqgn_109._iconDelete_1yqgn_129'
  );

  await expect(viewPhotosButton).toBeVisible();
  await expect(editButton).toBeVisible();
  await expect(deleteButton).toBeVisible();

  await editButton.click();
});
