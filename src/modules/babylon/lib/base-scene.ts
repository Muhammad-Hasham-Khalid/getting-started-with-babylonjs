import { Engine, Scene } from "@babylonjs/core";
import type { CustomSceneOptions } from "./types";

const defaultOptions: CustomSceneOptions = {
  debug: false,
};

export abstract class BaseScene {
  protected engine: Engine;
  protected scene: Scene;

  constructor(canvas: HTMLCanvasElement, options = defaultOptions) {
    this.engine = new Engine(canvas);
    this.scene = this.createScene();

    // binding methods
    this.render = this.render.bind(this);

    // show devtools
    if (options.debug) {
      this.scene.debugLayer.show();
    } else {
      this.scene.debugLayer.hide();
    }

    this.engine.runRenderLoop(this.render);
  }

  /**
   *
   * @param engine
   * @description create the scene with all the additional items in this function and return so that it can be consumed
   */
  abstract createScene(engine?: Engine): Scene;

  /**
   *
   * @description this method contains the rendering logic for the scene and can be overriden if needed
   */
  render() {
    this.scene.render();
  }
}
