import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

async function capture(page, name) {
  await mkdir("test-results/screenshots", { recursive: true });
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true, animations: "disabled" });
}

test("public pages and responsive navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/PragnyX/);
  await expect(page.getByRole("heading", { name: /Good decisions.*clarity/i })).toBeVisible();
  await capture(page, "home-desktop");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });
  await navigation.getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator(".service-grid-all .service-card")).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await capture(page, "services-mobile");

  await page.setViewportSize({ width: 1365, height: 900 });
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /A steady hand for every financial decision/i })).toBeVisible();
  await capture(page, "about-desktop");

  await page.goto("/services/income-tax-filing");
  await expect(page.getByRole("heading", { name: "Income Tax Filing" })).toBeVisible();
  await capture(page, "service-detail");

  await page.goto("/contact");
  await page.locator('input[name="name"]').fill("Public Browser Test");
  await page.locator('input[name="email"]').fill(`public-${Date.now()}@example.test`);
  await page.locator('input[name="phone"]').fill("+91 98765 43210");
  await page.locator('input[name="subject"]').fill("Browser test public inquiry");
  await page.locator('textarea[name="message"]').fill("Please contact me about your accounting services.");
  await page.getByRole("button", { name: /Send inquiry/ }).click();
  await expect(page.getByText("Thank you. Your inquiry has been received.")).toBeVisible();
  await capture(page, "contact");
});

test("client and administrator business workflows", async ({ page }) => {
  const runId = process.env.GITHUB_RUN_ID || String(Date.now());
  const email = `pragnyx-browser-${runId}@example.test`;
  const password = process.env.E2E_CLIENT_PASSWORD;
  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;
  if (!password || !adminEmail || !adminPassword) {
    throw new Error("Set E2E_CLIENT_PASSWORD, E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD for browser tests.");
  }

  await page.goto("/register");
  await page.locator('input[name="name"]').fill("Browser QA Client");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="phone"]').fill("+91 98765 43210");
  await page.locator('input[name="password"]').fill(password);
  await page.locator('input[name="confirmPassword"]').fill(password);
  await page.getByRole("button", { name: /Create account/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /Welcome back, Browser/i })).toBeVisible();
  await capture(page, "client-dashboard");

  const requestForm = page.locator(".request-form");
  await requestForm.locator('select[name="service"]').selectOption({ label: "Income Tax Filing" });
  await requestForm.locator('textarea[name="details"]').fill("Please help me file my income tax return.");
  await requestForm.getByRole("button", { name: /Submit request/ }).click();
  await expect(page.getByText("Your service request has been submitted.")).toBeVisible();

  const profile = page.locator(".profile-edit-panel");
  await profile.locator('input[name="name"]').fill("Browser QA Client Updated");
  await profile.getByRole("button", { name: /Save profile/ }).click();
  await expect(profile.getByText("Your profile has been updated.")).toBeVisible();

  await page.goto("/contact");
  await page.locator('input[name="name"]').fill("Browser QA Client Updated");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="phone"]').fill("+91 98765 43210");
  await page.locator('input[name="subject"]').fill("Browser QA client inquiry");
  await page.locator('textarea[name="message"]').fill("This signed-in inquiry should appear in my dashboard.");
  await page.getByRole("button", { name: /Send inquiry/ }).click();
  await expect(page.getByText("Thank you. Your inquiry has been received.")).toBeVisible();

  await page.goto("/booking");
  const bookingForm = page.locator("form.form-card");
  const date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  await bookingForm.locator('input[name="name"]').fill("Browser QA Client Updated");
  await bookingForm.locator('input[name="email"]').fill(email);
  await bookingForm.locator('input[name="phone"]').fill("+91 98765 43210");
  await bookingForm.locator('select[name="service"]').selectOption({ label: "Income Tax Filing" });
  await bookingForm.locator('input[name="date"]').fill(date);
  await bookingForm.locator('select[name="time"]').selectOption("10:30");
  await bookingForm.locator('textarea[name="message"]').fill("Please discuss income tax filing.");
  await bookingForm.getByRole("button", { name: /Submit booking request/ }).click();
  await expect(page.getByText(/Your consultation request has been submitted/)).toBeVisible();
  await page.goto("/dashboard");
  const bookingPanel = page.locator(".portal-panel").filter({ hasText: "Consultation bookings" });
  await expect(bookingPanel.getByText("Income Tax Filing")).toBeVisible();
  await expect(bookingPanel.getByText("pending")).toBeVisible();

  await page.locator(".site-header").getByRole("button", { name: "Sign out" }).click();
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(adminEmail);
  await page.locator('input[name="password"]').fill(adminPassword);
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: /Firm overview/i })).toBeVisible();
  await capture(page, "admin-dashboard");

  await page.getByRole("tab", { name: "Bookings" }).click();
  const bookingRow = page.getByRole("row").filter({ hasText: email });
  await expect(bookingRow).toBeVisible();
  await bookingRow.getByRole("combobox").selectOption("approved");
  await expect(page.getByText("Booking status updated.")).toBeVisible();

  await page.getByRole("tab", { name: "Inquiries" }).click();
  const inquiryRow = page.getByRole("row").filter({ hasText: "Browser QA client inquiry" });
  await expect(inquiryRow).toBeVisible();
  await inquiryRow.getByRole("combobox").selectOption("in-progress");
  await expect(page.getByText("Inquiry status updated.")).toBeVisible();

  await page.getByRole("tab", { name: "Service requests" }).click();
  const requestRow = page.getByRole("row").filter({ hasText: email });
  await expect(requestRow).toBeVisible();
  await requestRow.getByRole("combobox").selectOption("in-progress");
  await expect(page.getByText("Service request status updated.")).toBeVisible();

  await page.getByRole("tab", { name: "Clients" }).click();
  await expect(page.getByRole("row").filter({ hasText: email })).toBeVisible();

  await page.getByRole("tab", { name: "Services" }).click();
  const addForm = page.locator("form.inline-add-form");
  await addForm.locator('input[name="name"]').fill("Browser QA Temporary Service");
  await addForm.locator('input[name="slug"]').fill("browser-qa-temporary-service");
  await addForm.locator('input[name="shortDescription"]').fill("Temporary browser test service.");
  await addForm.locator('input[name="description"]').fill("Created automatically by the browser test and archived at its end.");
  await addForm.getByRole("button", { name: /Add/ }).click();
  let serviceRow = page.getByRole("row").filter({ hasText: "Browser QA Temporary Service" });
  await expect(serviceRow).toBeVisible();
  await serviceRow.getByRole("button", { name: "Edit" }).click();
  const editForm = page.locator("form.service-edit-form");
  await editForm.getByLabel("Service name").fill("Browser QA Temporary Service Updated");
  await editForm.getByLabel("Service URL slug").fill("browser-qa-temporary-service-updated");
  await editForm.getByRole("button", { name: "Save changes" }).click();
  serviceRow = page.getByRole("row").filter({ hasText: "Browser QA Temporary Service Updated" });
  await expect(serviceRow).toBeVisible();
  page.once("dialog", dialog => dialog.accept());
  await serviceRow.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("row").filter({ hasText: "Browser QA Temporary Service Updated" })).toHaveCount(0);

  await page.locator(".site-header").getByRole("button", { name: "Sign out" }).click();
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator(".portal-panel").filter({ hasText: "Consultation bookings" }).getByText("approved")).toBeVisible();
  await expect(page.getByText("Browser QA client inquiry")).toBeVisible();
  await expect(page.locator(".portal-panel").filter({ hasText: "Service requests" }).getByText("in progress")).toBeVisible();
  await capture(page, "client-after-admin-updates");
});
