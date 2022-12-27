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
  }

  initialize: () => void | Promise<void> = async () => {
    this.scene = await this.createScene();

    await this.createEnvironment();

    // show devtools
    if (this.options.debug) {
      this.scene.debugLayer.show();
    } else {
      this.scene.debugLayer.hide();
    }

    this.engine.runRenderLoop(this.render);
  };

  /**
   * @param engine
   * @description Create the scene with or without the additional items in this function
   */
  abstract createScene: (engine?: Engine) => Scene | Promise<Scene>;

  /**
   * @description Create the environment for the scene in this method.
   * It is called just after the scene is created.
   */
  createEnvironment: () => void | Promise<void> = () => {};

  /**
   * @description This method contains the rendering logic for the scene and can be overriden if needed
   */
  render = () => {
    if (!this.scene) {
      throw new Error("initialize() should be called before calling render()");
    }

    this.scene.render();
  };
}
