import {
  AnimationGroup,
  CubeTexture,
  FreeCamera,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { BaseScene } from "./lib/base-scene";

export class AnimationBlending extends BaseScene {
  createScene = () => {
    const scene = new Scene(this.engine);
    const envTex = CubeTexture.CreateFromPrefilteredData(
      "/environments/wide-street.env",
      scene
    );

    envTex.gammaSpace = false;

    envTex.rotationY = Math.PI / 2;

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true, 1000, 0.25);

    const camera = new FreeCamera("camera", new Vector3(0, 2, -6), this.scene);
    camera.attachControl();
    camera.minZ = 0.5;
    camera.speed = 0.5;

    return scene;
  };

  createEnvironment = async (scene = this.scene) => {
    if (!scene) {
      throw new Error("scene not initialized yet!");
    }

    await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Prototype_Level_Simplified.glb"
    );

    await this.createCharacter(scene);
  };

  async createCharacter(scene = this.scene!) {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "character_blending.glb"
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI);

    const idle = animationGroups[0];
    const run = animationGroups[1];

    scene.onPointerDown = (evt) => {
      if (evt.button === 2)
        scene.onBeforeRenderObservable.runCoroutineAsync(
          this.animationBlending(run, idle)
        );

      if (evt.button === 0)
        scene.onBeforeRenderObservable.runCoroutineAsync(
          this.animationBlending(idle, run)
        );
    };
  }

  *animationBlending(toAnim: AnimationGroup, fromAnim: AnimationGroup) {
    let currentWeight = 1;
    let newWeight = 0;

    toAnim.play(true);

    while (newWeight < 1) {
      newWeight += 0.01;
      currentWeight -= 0.01;
      toAnim.setWeightForAllAnimatables(newWeight);
      fromAnim.setWeightForAllAnimatables(currentWeight);
      yield;
    }
  }
}
