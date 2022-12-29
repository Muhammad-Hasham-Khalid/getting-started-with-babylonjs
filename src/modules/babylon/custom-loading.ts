import {
  CubeTexture,
  FreeCamera,
  GlowLayer,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class CustomLoading extends BaseScene {
  createScene = (engine = this.engine) => {
    const scene = new Scene(engine);

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "environments/wide-street.env",
      scene
    );

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex);

    // add camera
    const cameraPos = new Vector3(0, 1, -5);
    const camera = new FreeCamera("camera", cameraPos, scene);
    camera.attachControl();
    camera.speed = 0.3;

    return scene;
  };

  createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "LightingScene.glb",
      this.scene
    );

    const glowLayer = new GlowLayer("glowLayer", this.scene);
    glowLayer.intensity = 0.75;
  };
}
