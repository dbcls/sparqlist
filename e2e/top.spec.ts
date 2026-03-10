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

		const items = page.locator(".list-group a.list-group-item");
		const initialCount = await items.count();
		expect(initialCount).toBeGreaterThan(1);
		await expect(items.first()).toBeVisible();
		const firstItemHref = await items.first().getAttribute("href");
		const firstItemId = firstItemHref ? firstItemHref.replace(/^\//, "") : "";
		expect(firstItemId).not.toBe("");
		const searchText = firstItemId;

		await page.fill("input[type=search]", searchText);

		await expect(items).toHaveCount(1);
		await expect(items.first()).toHaveAttribute("href", `/${firstItemId}`);
	});
});
