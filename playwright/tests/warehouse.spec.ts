import { test, expect } from '@playwright/test';

import { WarehouseMap } from '../pages/warehouse.page';


test('a user can hover over the map and the pose values show in the input fields', async({ page }) => {
  const warehouse = new WarehouseMap(page);
  await warehouse.page.goto('/');

  await warehouse.hoverOverCanvas(45, 98);
  //   the values are converted to integers because the test runner while headless could have  an error of between 0.1 to 1.1
  const xValue = parseInt(await warehouse.xAxisInput.inputValue(), 10);
  const yValue = parseInt(await warehouse.yAxisInput.inputValue(), 10);
  expect(yValue).toBe(98);
  expect(xValue).toBe(45);
});

test('a user can see the online/offline state', async({ page }) => {
  const warehouse = new WarehouseMap(page);
  await warehouse.page.goto('/');

  const connectionOnline = warehouse.page.locator('span', { hasText: /connection online/i});
  await expect(connectionOnline).toBeVisible();
});

test('a user can see the paused/unpaused state', async({ page }) => {
  const warehouse = new WarehouseMap(page);
  await warehouse.page.goto('/');

  const robotMoving = warehouse.page.locator('span', { hasText: /robot moving/i});
  await expect(robotMoving).toBeVisible();
  await warehouse.pauseRobotButton();
  const robotPausedLabel = warehouse.page.locator('span', { hasText: /robot paused/i});
  await expect(robotMoving).not.toBeVisible();
  await expect(robotPausedLabel).toBeVisible();

  await warehouse.unpauseRobotButton();
});
