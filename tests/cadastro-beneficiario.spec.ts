import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  await page.getByPlaceholder("Email*").fill("admin@admin.com");
  await page.getByPlaceholder("Senha*").fill("adminpass");

  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("http://localhost:5173/");
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Beneficiário" }).click();
  await expect(page).toHaveURL(/beneficiario/);
  page.getByRole("button", { name: "Cadastrar Beneficiário" }).click();
});

test("Cadastro de Beneficiário - renderiza formulário completo", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "Cadastro de Beneficiário" }),
  ).toBeVisible();

  await expect(page.getByText("Atenção aos campos obrigatórios")).toBeVisible();

  await expect(page.locator('input[name="nome"]')).toBeVisible();
  await expect(page.locator('input[name="nome_responsavel"]')).toBeVisible();
  await expect(page.locator('input[name="data_nascimento"]')).toBeVisible();
  await expect(page.locator('input[name="phone1"]')).toBeVisible();
  await expect(page.locator('input[name="phone2"]')).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Cadastrar beneficiário" }),
  ).toBeVisible();
});

test("Cadastro de Beneficiário - botão cadastrar deve iniciar desabilitado", async ({
  page,
}) => {
  const submitButton = page.getByRole("button", {
    name: "Cadastrar beneficiário",
  });

  await expect(submitButton).toBeDisabled();
});
