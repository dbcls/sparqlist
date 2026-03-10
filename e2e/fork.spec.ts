import { test, expect } from "@playwright/test";

test("fork", async ({ page }) => {
	await page.goto("/-login");

	await page.fill("input[id=password]", "admin-password");
	await page.getByRole("button", { name: "Login" }).click();
	await expect(page).toHaveURL("/");

	await page.goto("/adjacent_prefectures");

	const sparqletId = `fork-${Date.now()}`;

	await page.getByRole("link", { name: "Fork" }).click();
	await expect(page).toHaveURL("/-new?forkFrom=adjacent_prefectures");

	const sparqletNameInput = page.locator(".card-header input.form-control").first();
	await sparqletNameInput.fill(sparqletId);
	await expect(sparqletNameInput).toHaveValue(sparqletId);

	await page.click("text=Save");
	await expect(page).toHaveURL(`/${sparqletId}`);

	await page.getByRole("link", { name: "Markdown" }).click();
	await expect(page.locator("pre code").last()).toContainText("# Adjacent Prefectures");

	page.on("dialog", (dialog) => dialog.accept());
	await page.click("text=Delete");
	await expect(page).toHaveURL("/");
});
