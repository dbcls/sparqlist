import { test, expect } from "@playwright/test";

test.describe("login", () => {
	test("bad password", async ({ page }) => {
		await page.goto("/-login");

		await page.fill("input[id=password]", "bad-password");
		await page.getByRole("button", { name: "Login" }).click();
		await expect(page.getByRole("alert")).toContainText("Authenitacion failed");
	});

	test("successful login and logout", async ({ page }) => {
		await page.goto("/-login");

		await page.fill("input[id=password]", "admin-password");
		await page.getByRole("button", { name: "Login" }).click();

		await expect(page).toHaveURL("/");

		await page.getByRole("link", { name: "Logout" }).click();
		await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
	});
});
