import {
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { CustomSceneOptions } from "./types";

const defaultOptions: CustomSceneOptions = {
  debug: false,
};

export class StandardMaterials {
  private engine: Engine;
  private scene: Scene;

  constructor(canvas: HTMLCanvasElement, options = defaultOptions) {
    this.engine = new Engine(canvas);
    this.scene = this.createScene();

    // show devtools
    if (options.debug) {
      this.scene.debugLayer.show();
    } else {
      this.scene.debugLayer.hide();
    }

    this.engine.runRenderLoop(this.render);
  }

  private createScene = (engine: Engine = this.engine) => {
    const scene = new Scene(engine);

    // add camera
    const cameraPos = new Vector3(0, 1, -5);
    const camera = new FreeCamera("camera", cameraPos, scene);
    camera.attachControl();

    // add hemispheric light
    const hLightPos = new Vector3(0, 1, 0);
    const hLight = new HemisphericLight("hLight", hLightPos, scene);
    hLight.intensity = 0.5;

    // add ground
    const groundSize = { width: 100, height: 100 };
    MeshBuilder.CreateGround("ground", groundSize, scene);

    // add ball
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
    ball.position = new Vector3(0, 1, 0);

    return scene;
  };

  private render = () => {
    // rendering implementation
    this.scene.render();
  };
}
