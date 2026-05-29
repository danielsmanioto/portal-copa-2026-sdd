const { test, expect } = require('@playwright/test');

test('fluxo feliz do portal copa 2026', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Copa do Mundo 2026' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Acesso' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tabela da Copa' })).toBeVisible();

  await page.getByRole('link', { name: 'Acesso' }).click();
  await expect(page).toHaveURL(/\/acesso\.html$/);
  await expect(page.getByRole('heading', { name: 'Escolha como deseja continuar' })).toBeVisible();

  await page.getByRole('link', { name: 'Ir para login' }).click();
  await expect(page).toHaveURL(/\/login\.html$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Senha')).toBeVisible();

  await page.getByRole('link', { name: 'Não tem conta? Criar cadastro' }).click();
  await expect(page).toHaveURL(/\/cadastro\.html$/);
  await expect(page.getByRole('heading', { name: 'Novo cadastro' })).toBeVisible();
  await expect(page.getByLabel('Nome completo')).toBeVisible();
  await expect(page.getByLabel('Confirmar senha')).toBeVisible();

  await page.getByRole('link', { name: '← Voltar para acesso' }).click();
  await expect(page).toHaveURL(/\/acesso\.html$/);
  await expect(page.getByRole('heading', { name: 'Escolha como deseja continuar' })).toBeVisible();
});
