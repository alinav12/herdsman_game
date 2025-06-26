import { Graphics, Point } from "pixi.js";
import { MainHero } from "./MainHero";

export class Animal {
  graphics: Graphics;
  position: Point;
  following: boolean = false;
  followTarget: MainHero | null = null;
  followPosition: Point = new Point(0, 0);
  private speed = 2;

  private patrolCenter: Point;
  private patrolRadius = 30;
  private patrolAngle = 0;
  private patrolSpeed = 1;

  constructor(x: number, y: number) {
    this.position = new Point(x, y);
    this.graphics = new Graphics();
    this.graphics.fill(0xffffff);
    this.graphics.circle(0, 0, 10);
    this.graphics.fill();
    this.graphics.position.set(x, y);

    this.patrolCenter = new Point(x, y);
  }

  startFollowing(hero: MainHero) {
    this.following = true;
    this.followTarget = hero;
    this.followPosition.set(hero.position.x, hero.position.y);
  }

  stopFollowing() {
    this.following = false;
    this.followTarget = null;
    this.patrolCenter.set(this.position.x, this.position.y);
    this.patrolAngle = 0;
  }

  update() {
    if (this.following && this.followTarget) {
      const dx = this.followPosition.x - this.position.x;
      const dy = this.followPosition.y - this.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        const vx = (dx / dist) * this.speed;
        const vy = (dy / dist) * this.speed;
        this.position.set(this.position.x + vx, this.position.y + vy);
        this.graphics.position.set(this.position.x, this.position.y);
      }
    }
  }

  patrolUpdate(dt: number) {
    if (this.following) return;

    this.patrolAngle += this.patrolSpeed * dt;
    if (this.patrolAngle > Math.PI * 2) this.patrolAngle -= Math.PI * 2;

    const targetX =
      this.patrolCenter.x + Math.cos(this.patrolAngle) * this.patrolRadius;
    const targetY =
      this.patrolCenter.y + Math.sin(this.patrolAngle) * this.patrolRadius;

    const dx = targetX - this.position.x;
    const dy = targetY - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      const vx = (dx / dist) * this.speed * 0.5;
      const vy = (dy / dist) * this.speed * 0.5;
      this.position.set(this.position.x + vx, this.position.y + vy);
      this.graphics.position.set(this.position.x, this.position.y);
    }
  }
}
