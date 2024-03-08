import { test, expect } from "@playwright/test";

test("create, edit and delete", async ({ page, baseURL }) => {
	await page.goto("/");

	const sparqletId = `test-${new Date().getTime()}`;

	await expect(page.getByRole("navigation")).toContainText("SPARQList");
	await page.getByRole("Link", { name: "New SPARQLet" }).click();

	await page.fill("input[id=password]", "admin-password");
	await page.getByRole("button", { name: "Login" }).click();

	// create
	await page.fill("input[class=form-control]", sparqletId);

	await page.locator(".CodeMirror textarea").fill("# Foo SPARQLet");
	await page.click("text=Save");

	// view
	await expect(page).toHaveURL(`/${sparqletId}`);
	await expect(page.getByRole("heading").first()).toHaveText("Foo SPARQLet");

	await expect(
		page
			.getByRole("paragraph")
			.getByRole("link", { name: `${baseURL}/api/${sparqletId}` }),
	).toBeVisible();

	// execute
	await page.click("text=Execute");
	await expect(
		page.getByRole("heading", { name: "Response 200 OK" }),
	).toBeVisible();

	// switch to markdown view
	await page.getByRole("link", { name: "Markdown" }).click();
	await expect(page.locator("pre code").last()).toHaveText("# Foo SPARQLet");

	// edit
	await page.click("text=Edit");
	await page.locator(".CodeMirror textarea").focus();
	await page.keyboard.press("Control+A");
	await page.locator(".CodeMirror-code").pressSequentially("# Bar SPARQLet");
	await page.click("text=Save");

	await expect(page).toHaveURL(`/${sparqletId}`);
	await expect(page.getByRole("heading").first()).toHaveText("Bar SPARQLet");

	// delete
	page.on("dialog", (dialog) => dialog.accept());
	await page.click("text=Delete");
	await expect(page).toHaveURL("/");
});
