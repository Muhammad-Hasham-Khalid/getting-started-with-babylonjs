import {
  FreeCamera,
  HemisphericLight,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class FirstPersonController extends BaseScene {
  camera?: FreeCamera;

  createScene = (engine = this.engine) => {
    const scene = new Scene(engine);

    new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene!);

    scene.onPointerDown = (event) => {
      // press mouse left click
      if (event.button === 0) this.engine.enterPointerlock();

      // press mouse right click
      if (event.button === 1) this.engine.exitPointerlock();
    };

    const fps = 60;
    const gravity = -9.81;
    scene.gravity = new Vector3(0, gravity / fps, 0); // adjusting gravity according to fps
    scene.collisionsEnabled = true;

    return scene;
  };

  createEnvironment = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Prototype_Level.glb",
      this.scene
    );

    meshes.forEach((mesh) => {
      mesh.checkCollisions = true;
    });

    this.createController();
  };

  createController = (scene = this.scene) => {
    this.camera = new FreeCamera("camera", new Vector3(0, 10, 0), this.scene);
    this.camera.attachControl();

    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;
    this.camera.speed = 0.5;
    this.camera.angularSensibility = 4000;

    this.camera.ellipsoid = new Vector3(1, 1, 1);

    // setting WASD
    this.camera.keysUp.push(87);
    this.camera.keysDown.push(83);
    this.camera.keysLeft.push(65);
    this.camera.keysRight.push(68);

    this.camera.minZ = 0.45;
  };
}
