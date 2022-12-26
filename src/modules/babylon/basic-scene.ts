import {
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class BasicScene extends BaseScene {
  createScene = (engine: Engine = this.engine) => {
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
}
