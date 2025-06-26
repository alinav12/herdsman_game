import { Text, TextStyle } from "pixi.js";

export class ScoreUI {
  text: Text;
  private score: number = 0;

  constructor() {
    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0x000000,
      fontWeight: "bold",
    });

    this.text = new Text({
      text: "Score: ",
      style,
    });

    this.text.position.set(10, 10);
  }

  increaseScore(amount: number) {
    this.score += amount;
    this.updateScore(this.score);
  }

  updateScore(score: number) {
    this.text.text = `Score: ${score}`;
  }
}
