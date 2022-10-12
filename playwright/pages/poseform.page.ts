import type { Locator, Page } from  '@playwright/test';
export class PoseFormClass{
  readonly page: Page;
  xAxisInput: Locator;
  yAxisInput: Locator;
  angleInput: Locator;
  pauseButton: Locator;
  unpauseButton: Locator;

  constructor(page:Page){
    this.page=page;
    this.xAxisInput=this.page.locator('[name="x-axis"]');
    this.yAxisInput=this.page.locator('[name="y-axis"]');
    this.angleInput=this.page.locator('[name="angle"]');
    this.pauseButton=this.page.locator('button:has-text("Stop moving")');
    this.unpauseButton=this.page.locator('button:has-text("Start moving")');
  }
  async typeXaxisText(integer: number){
    await this.xAxisInput.fill('');
    await this.xAxisInput.type(`${integer}`);
  }
  async typeYaxisText(integer: number){
    await this.yAxisInput.fill('');
    await this.yAxisInput.type(`${integer}`);
  }

  async typeAngleText(integer: number){
    await this.angleInput.fill('');
    await this.angleInput.type(`${integer}`);
  }

  async pauseRobotButton(){
    await this.pauseButton?.click();
  }
  async unpauseRobotButton(){
    await this.unpauseButton?.click();
  }
  async pressEnter(){
    await this.page.keyboard.press('Enter');
  }
}