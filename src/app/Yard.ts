import { Graphics, Point } from "pixi.js";

export class Yard {
  graphics: Graphics;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.graphics = new Graphics();
    this.graphics.fill(0xffff00);
    this.graphics.rect(0, 0, width, height);
    this.graphics.fill();
    this.graphics.position.set(x, y);
  }

  containsPoint(p: Point) {
    return (
      p.x >= this.x &&
      p.x <= this.x + this.width &&
      p.y >= this.y &&
      p.y <= this.y + this.height
    );
  }
}
