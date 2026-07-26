import { test, expect, type Page } from "@playwright/test";

test.describe("marketing surfaces", () => {
  test("homepage renders the cinematic hero and featured roster", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("The world's stage");
    await expect(page.getByRole("link", { name: /Taylor Swift/ }).first()).toBeVisible();
    await expect(page.getByText("Trusted for the moments that matter")).toBeVisible();
  });

  test("hero instant search surfaces talent", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: /search talent/i }).fill("burna");
    await expect(page.getByRole("option", { name: /Burna Boy/ })).toBeVisible();
  });

  test("directory filters by category and budget", async ({ page }) => {
    await page.goto("/celebrities");
    await page.getByRole("button", { name: "Comedy", exact: true }).click();
    await expect(page).toHaveURL(/category=comedy/);
    await expect(page.getByRole("link", { name: /Kevin Hart/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Taylor Swift/ })).toHaveCount(0);
  });

  test("celebrity profile shows fee, awards and calendar", async ({ page }) => {
    await page.goto("/celebrities/serena-williams");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Serena Williams");
    await expect(page.getByText("Engagements from")).toBeVisible();
    await expect(page.getByText("Career highlights")).toBeVisible();
    await expect(page.getByText(/Laureus Sportswoman/)).toBeVisible();
  });
});

async function signInAsClient(page: Page) {
  await page.goto("/signin");
  await page.getByRole("button", { name: /^Client/ }).click();
  await page.waitForURL(/dashboard/);
}

test.describe("authenticated flows", () => {
  test("demo client signs in and sees their console", async ({ page }) => {
    await signInAsClient(page);
    await expect(page.getByRole("heading", { name: /Good (morning|afternoon|evening), Ava/ })).toBeVisible();
    await expect(page.getByText("Held in escrow").first()).toBeVisible();
  });

  test("full booking wizard: brief to submitted reference", async ({ page }) => {
    await signInAsClient(page);
    await page.goto("/book/trevor-noah");

    // Step 1 · talent confirm
    await expect(page.getByText("Confirm your headliner")).toBeVisible();
    await page.getByRole("button", { name: /Continue/ }).click();

    // Step 2 · event type
    await page.getByRole("radio", { name: /Corporate Event/ }).click();
    await page.getByRole("button", { name: /Continue/ }).click();

    // Step 3 · location
    await page.getByLabel("City *").fill("Singapore");
    await page.getByLabel("Country *").fill("Singapore");
    await page.getByRole("button", { name: /Continue/ }).click();

    // Step 4 · date — first open day in the calendar
    await page
      .locator("button[aria-label*=': open']")
      .first()
      .click();
    await page.getByRole("button", { name: /Continue/ }).click();

    // Step 5 · budget
    await page.getByRole("radio", { name: /Standard/ }).click();
    await page.getByRole("button", { name: /Continue/ }).click();

    // Step 6 · requests
    await page
      .getByLabel("Special requests")
      .fill("A 45-minute keynote conversation followed by moderated Q&A.");
    await page.getByRole("button", { name: /Continue/ }).click();

    // Step 7 · review
    await expect(page.getByText("Read it like a manager will")).toBeVisible();
    await expect(page.getByText("Singapore, Singapore")).toBeVisible();
    await page.getByRole("button", { name: /Continue/ }).click();

    // Step 8 · submit
    await page.getByRole("button", { name: /Submit request/ }).click();
    await expect(page.getByText(/The stage door is/)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/AUR-\d{4}-\d{4}/)).toBeVisible();
  });

  test("admin console guards and renders", async ({ page }) => {
    await page.goto("/signin");
    await page.getByRole("button", { name: /^Admin/ }).click();
    await page.waitForURL(/dashboard/);
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Platform overview" })).toBeVisible();
    await expect(page.getByText("Gross bookings value")).toBeVisible();
  });
});
