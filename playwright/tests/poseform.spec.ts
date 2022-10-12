import { test, expect } from '@playwright/test';

import { PoseFormClass } from '../pages/poseform.page';


test('a user should input value for X axis', async({ page }) => {
  const poseForm = new PoseFormClass(page);
  await poseForm.page.goto('/');
  expect(poseForm.page.url()).toBe('http://localhost:3000/');

  await poseForm.typeXaxisText(80);
  await expect(poseForm.xAxisInput).toHaveValue('80');
});

test('a user should input value for Y axis', async({ page }) => {
  const poseForm = new PoseFormClass(page);
  await poseForm.page.goto('/');

  await poseForm.typeYaxisText(40);
  await expect(poseForm.yAxisInput).toHaveValue('40');
});

test('a user should input value for angle', async({ page }) => {
  const poseForm = new PoseFormClass(page);
  await poseForm.page.goto('/');

  await poseForm.typeAngleText(1.34);
  await expect(poseForm.angleInput).toHaveValue('1.34');
});

test('a user should fill all inputs and submit by pressing "enter"', async({ page }) => {
  const poseForm = new PoseFormClass(page);
  await poseForm.page.goto('/');

  await poseForm.typeXaxisText(80);
  await poseForm.typeYaxisText(40);
  await poseForm.typeAngleText(1.34);
  await poseForm.pressEnter();
  poseForm.page.on('websocket', websocket => {
    websocket.on('framesent', event => {
      expect(event.payload).toBe(JSON.stringify({x: 0, y: 40, angle: 1.34 }));
    });
    expect(websocket.url()).toBe('ws://localhost:3000/api/paused');
  });
});
