import { Graphics, Point } from "pixi.js";

export class MainHero {
  graphics: Graphics;
  position: Point;
  private speed = 3;
  private destination: Point | null = null;

  constructor(x: number, y: number) {
    this.position = new Point(x, y);
    this.graphics = new Graphics();
    this.graphics.fill(0xff0000);
    this.graphics.circle(0, 0, 15);
    this.graphics.fill();
    this.graphics.position.set(x, y);
  }

  moveTo(x: number, y: number) {
    this.destination = new Point(x, y);
  }

  update() {
    if (!this.destination) return;

    const dx = this.destination.x - this.position.x;
    const dy = this.destination.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.speed) {
      this.position.set(this.destination.x, this.destination.y);
      this.destination = null;
    } else {
      const vx = (dx / dist) * this.speed;
      const vy = (dy / dist) * this.speed;
      this.position.set(this.position.x + vx, this.position.y + vy);
    }
    this.graphics.position.set(this.position.x, this.position.y);
  }
}
