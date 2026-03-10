import { test, expect } from "@playwright/test";

test("fork", async ({ page }) => {
	await page.goto("/-login");

	await page.fill("input[id=password]", "admin-password");
	await page.getByRole("button", { name: "Login" }).click();
	await expect(page).toHaveURL("/");

	const sourceId = `source-${Date.now()}`;
	const forkId = `fork-${Date.now()}`;

	await page.getByRole("link", { name: "New SPARQLet" }).click();
	await expect(page).toHaveURL("/-new");

	const sparqletNameInput = page.locator(".card-header input.form-control").first();
	await sparqletNameInput.fill(sourceId);
	await page.locator(".cm-content").click();
	await page.keyboard.insertText("# Source SPARQLet");
	await page.click("text=Save");
	await expect(page).toHaveURL(`/${sourceId}`);

	await page.getByRole("link", { name: "Fork" }).click();
	await expect(page).toHaveURL(`/-new?forkFrom=${sourceId}`);

	await sparqletNameInput.fill(forkId);
	await page.click("text=Save");
	await expect(page).toHaveURL(`/${forkId}`);

	await page.getByRole("link", { name: "Markdown" }).click();
	await expect(page.locator("pre code").last()).toContainText("# Source SPARQLet");

	page.on("dialog", (dialog) => dialog.accept());
	await page.click("text=Delete");
	await expect(page).toHaveURL("/");

	await page.goto(`/${sourceId}`);
	await page.click("text=Delete");
	await expect(page).toHaveURL("/");
});
