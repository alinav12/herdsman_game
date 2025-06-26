import { setEngine } from "./app/getEngine";
import { CreationEngine } from "./engine/engine";

import { Game } from "./app/Game.ts";

const engine = new CreationEngine();
setEngine(engine);

(async () => {
  await engine.init({
    background: "#90EE90",
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  });

  const game = new Game();
  game.start();
})();
