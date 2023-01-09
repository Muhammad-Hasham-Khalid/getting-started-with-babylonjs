import {
  AnimationGroup,
  CubeTexture,
  FreeCamera,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class CutScene extends BaseScene {
  camera?: FreeCamera;
  characterAnimations: AnimationGroup[] = [];

  createScene = (engine = this.engine) => {
    const scene = new Scene(engine);

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "/environments/wide-street.env",
      scene
    );

    envTex.gammaSpace = false;
    envTex.rotationY = Math.PI / 2;
    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true, 1000, 0.25);

    this.camera = new FreeCamera("camera", new Vector3(0, 2, -10), this.scene);
    this.camera.attachControl();
    this.camera.minZ = 0.5;

    return scene;
  };

  createEnvironment = async () => {
    if (!this.scene) {
      throw new Error("scene not initialized");
    }

    await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Prototype_Level_Simplified.glb"
    );

    await this.createCharacter(this.scene);
    await this.createZombies(this.scene);
  };

  createCharacter = async (scene: Scene = this.scene!) => {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Character.glb",
      scene
    );

    meshes[0].rotate(Vector3.Up(), Math.PI);

    animationGroups[0].stop();

    animationGroups[2].play(true);
  };

  createZombies = async (scene: Scene = this.scene!) => {};
}
