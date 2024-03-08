import { test, expect } from "@playwright/test";

test.describe("/", () => {
	test("navigation", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByRole("navigation")).toContainText("SPARQList");
		await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
	});

	test("navigate to login", async ({ page }) => {
		await page.goto("/");
		await page.click("text=Login");

		await expect(page).toHaveURL("/-login");
	});

	test("search", async ({ page }) => {
		await page.goto("/");

		await expect(
			page.getByRole("link", { name: "gene_and_organism_annotation" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "adjacent_prefectures -" }),
		).toBeVisible();

		await page.fill("input[type=search]", "ge");

		await expect(
			page.getByRole("link", { name: "gene_and_organism_annotation" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "adjacent_prefectures -" }),
		).not.toBeVisible();
	});
});
