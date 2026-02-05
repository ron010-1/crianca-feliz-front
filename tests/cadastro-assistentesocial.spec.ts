import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  await page.getByPlaceholder("Email*").fill("admin@admin.com");
  await page.getByPlaceholder("Senha*").fill("adminpass");

  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("http://localhost:5173/");
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Assistente" }).click();
  await expect(page).toHaveURL(/assistente/);
  page.getByRole("button", { name: "Novo Assistente" }).click();
});

test("Cadastro de Assistente - renderiza formulário corretamente", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "Cadastro de assistente social" }),
  ).toBeVisible();

  await expect(page.getByPlaceholder("Nome*")).toBeVisible();
  await expect(page.getByPlaceholder("Telefone*")).toBeVisible();
  await expect(page.getByPlaceholder("Email*")).toBeVisible();
  await expect(page.getByPlaceholder("Senha*")).toBeVisible();

  await expect(page.getByRole("button", { name: "Cadastrar" })).toBeVisible();
});

test("Cadastro de Assistente - valida tentativa de envio com campos vazios", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Cadastrar" }).click();

  await expect(page).toHaveURL(/assistente/);
});

test("Cadastro de Assistente - cadastro com sucesso", async ({ page }) => {
  await page.getByPlaceholder("Nome*").fill("Assistente Playwright");
  await page.getByPlaceholder("Telefone*").fill("83999998888");
  await page.getByPlaceholder("Email*").fill("assistente.playwright@teste.com");
  await page.getByPlaceholder("Senha*").fill("123456");

  await page.getByRole("button", { name: "Cadastrar" }).click();

  await expect(page).toHaveURL(/assistente/);
});
