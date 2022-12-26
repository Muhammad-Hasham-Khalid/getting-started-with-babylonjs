import { Engine, Scene } from "@babylonjs/core";
import type { CustomSceneOptions } from "./types";

const defaultOptions: CustomSceneOptions = {
  debug: false,
};

export abstract class BaseScene {
  protected engine: Engine;
  protected scene?: Scene;
  protected options: CustomSceneOptions;

  constructor(canvas: HTMLCanvasElement, options = defaultOptions) {
    this.engine = new Engine(canvas);
    this.options = options;

    this.initialize = this.initialize.bind(this);
  }

  initialize() {
    // binding methods
    this.render = this.render.bind(this);
    this.createScene = this.createScene.bind(this);

    this.scene = this.createScene();

    // show devtools
    if (this.options.debug) {
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
    if (!this.scene) {
      throw new Error(
        "Uninitialized Scene Error: Scene not initialized yet initialize() should be called before render()"
      );
    }

    this.scene.render();
  }
}
