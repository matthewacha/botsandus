import type { Locator, Page } from  '@playwright/test';
import { PoseFormClass } from './poseform.page';

const toHundredth = (num: number) => Number((Math.round(num * 1000) / 1000).toFixed(3));
export class WarehouseMap extends PoseFormClass {
  mapCanvas: Locator;
  constructor(page: Page){
    super(page);
    this.mapCanvas = this.page.locator('canvas');
  }

  async hoverOverCanvas(xPose: number, yPose: number){

    const canvasBox = await this.mapCanvas.boundingBox();
    if(canvasBox){
      const delta = 200;  // number of pixels to add to x coordinate. The largr the delt, the more accurate the hover pmouse points
      const { height, x, y } = canvasBox;
      await this.mapCanvas.hover({ position: { x: x + delta, y: 40 + y }});
      const xAxis = await this.xAxisInput.inputValue();

      const mapperRatio = toHundredth((x+delta)/(10*Math.floor(parseFloat(xAxis))));
      const xOrdinate = (mapperRatio * xPose*10);
      const yOrdinate = height - (mapperRatio * yPose * 10);

      await this.mapCanvas.hover({ position: { x: xOrdinate , y: yOrdinate }});
    }
  }
}
