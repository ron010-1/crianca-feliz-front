import { test, expect } from '@playwright/test';

test('Login - cenário positivo (sucesso)', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.getByPlaceholder('Email*').fill('admin@admin.com');
  await page.getByPlaceholder('Senha*').fill('adminpass');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL('http://localhost:5173/'); 
});

test('Login - cenário negativo (falha)', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.getByPlaceholder('Email*').fill('admin@admin.com');
  await page.getByPlaceholder('Senha*').fill('adminpass1');

  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL('http://localhost:5173/login'); 
});
