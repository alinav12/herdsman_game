import { Application, Container, Point, Rectangle } from "pixi.js";
import { MainHero } from "./MainHero.ts";
import { Animal } from "./Animal.ts";
import { Yard } from "./Yard.ts";
import { ScoreUI } from "./ScoreUI.ts";
import { engine } from "./getEngine.ts";

function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export class Game {
  private app: Application;
  private readonly hero: MainHero;
  private animals: Animal[] = [];
  private yard: Yard;
  private scoreUI: ScoreUI;
  private animalsGroup: Animal[] = [];
  private maxAnimalsInGroup = 5;
  private readonly container: Container;

  private spawnCooldown = 0;
  private spawnIntervalMin = 1.5;
  private spawnIntervalMax = 4;
  private nextSpawnTime = 0;

  constructor() {
    this.app = engine();
    this.container = new Container();
    this.app.stage.addChild(this.container);

    this.yard = new Yard(650, 400, 120, 120);
    this.container.addChild(this.yard.graphics);

    this.hero = new MainHero(100, 100);
    this.container.addChild(this.hero.graphics);

    const animalCount = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < animalCount; i++) {
      this.spawnAnimalRandom();
    }

    this.scoreUI = new ScoreUI();
    this.app.stage.addChild(this.scoreUI.text);

    this.app.stage.interactive = true;
    this.app.stage.hitArea = new Rectangle(
      0,
      0,
      this.app.screen.width,
      this.app.screen.height,
    );

    this.app.stage.on("pointerdown", (event) => {
      const pos = event.getLocalPosition(this.app.stage);
      this.hero.moveTo(pos.x, pos.y);
    });

    this.app.ticker.add((ticker) => this.update(ticker.deltaTime));
    this.resetSpawnTimer();
  }

  start() {
    this.scoreUI.updateScore(0);
  }

  private resetSpawnTimer() {
    this.nextSpawnTime =
      Math.random() * (this.spawnIntervalMax - this.spawnIntervalMin) +
      this.spawnIntervalMin;
  }

  private spawnAnimalRandom() {
    const padding = 20;
    const x = Math.random() * (this.app.screen.width - padding * 2) + padding;
    const y = Math.random() * (this.app.screen.height - padding * 2) + padding;
    const animal = new Animal(x, y);
    this.animals.push(animal);
    this.container.addChild(animal.graphics);
  }

  private update(delta: number) {
    const dt = delta / 60;

    this.hero.update();

    this.spawnCooldown += dt;
    if (this.spawnCooldown >= this.nextSpawnTime) {
      this.spawnCooldown = 0;
      this.spawnAnimalRandom();
      this.resetSpawnTimer();
    }

    for (const animal of this.animals) {
      if (!animal.following) {
        const dist = distance(this.hero.position, animal.position);
        if (dist < 50 && this.animalsGroup.length < this.maxAnimalsInGroup) {
          animal.startFollowing(this.hero);
          this.animalsGroup.push(animal);
        } else {
          animal.patrolUpdate(dt);
        }
      }
      animal.update();
    }

    this.animalsGroup.forEach((animal, index) => {
      const offsetDistance = 30;
      const angle = Math.PI + index * 0.3;
      const targetX =
        this.hero.position.x + Math.cos(angle) * offsetDistance * (index + 1);
      const targetY =
        this.hero.position.y + Math.sin(angle) * offsetDistance * (index + 1);
      animal.followPosition.set(targetX, targetY);

      if (this.yard.containsPoint(animal.position)) {
        animal.stopFollowing();
        this.animalsGroup = this.animalsGroup.filter((a) => a !== animal);
        this.container.removeChild(animal.graphics);
        this.animals = this.animals.filter((a) => a !== animal);
        this.scoreUI.increaseScore(1);
      }
    });
  }
}
