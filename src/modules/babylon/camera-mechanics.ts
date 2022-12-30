import {
  Scene,
  AbstractMesh,
  SceneLoader,
  Vector3,
  CubeTexture,
  ArcRotateCamera,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class CameraMechanics extends BaseScene {
  watch?: AbstractMesh;
  camera?: ArcRotateCamera;

  createScene = async (engine = this.engine) => {
    const scene = new Scene(engine);

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "environments/wide-street.env",
      scene
    );

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex);

    this.createWatch(scene);
    this.createCamera(scene);

    return scene;
  };

  createCamera = (scene = this.scene) => {
    if (!scene) {
      throw new Error("scene not initialized yet");
    }

    // const camera = new FreeCamera("camera", new Vector3(0, 10, -50));
    // scene.addCamera(camera);
    // camera.attachControl();

    this.camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2,
      40,
      Vector3.Zero(),
      scene
    );

    this.camera.attachControl(true);
    this.camera.wheelPrecision = 100;
    // this.camera.minZ = 20;

    this.camera.lowerRadiusLimit = 1;
    this.camera.upperRadiusLimit = 3;

    // setting zero to disable panning
    this.camera.panningSensibility = 0;

    // this.camera.useBouncingBehavior = true;
    this.camera.useAutoRotationBehavior = true;
    this.camera.autoRotationBehavior!.idleRotationSpeed = 0.25;
    this.camera.autoRotationBehavior!.idleRotationSpinupTime = 4000; // ms
    this.camera.autoRotationBehavior!.idleRotationWaitTime = 4000; // ms
    this.camera.autoRotationBehavior!.zoomStopsAnimation = true;

    this.camera.useFramingBehavior = true;
    this.camera.framingBehavior!.radiusScale = 1;
  };

  createWatch = async (scene = this.scene) => {
    const watchModel = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "barrel.glb",
      scene
    );

    this.watch = watchModel.meshes[0];
    this.camera?.setTarget(watchModel.meshes[1]);

    return watchModel;
  };
}
