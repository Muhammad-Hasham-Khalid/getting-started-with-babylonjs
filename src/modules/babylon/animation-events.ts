import {
  AnimationEvent,
  AnimationGroup,
  CubeTexture,
  FreeCamera,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { BaseScene } from "./lib/base-scene";

export class AnimationEvents extends BaseScene {
  zombieAnims: AnimationGroup[] = [];
  cheer?: AnimationGroup;

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

    const camera = new FreeCamera("camera", new Vector3(0, 2, -10), this.scene);
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
    await this.createZombie(scene);
  };

  async createCharacter(scene: Scene = this.scene!) {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "character_attack.glb",
      scene
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(3, 0, 0);
    this.cheer = animationGroups[0];
    const idle = animationGroups[1];
    const attack = animationGroups[2];

    this.cheer.stop();
    idle.play(true);

    const attackAnim = animationGroups[2].targetedAnimations[0].animation;

    const attackEvt = new AnimationEvent(
      100, // 100th frame
      () => {
        this.zombieAnims[1].stop();
        this.zombieAnims[0].play();
      },
      false
    );
    attackAnim.addEvent(attackEvt);

    scene.onPointerDown = (evt) => {
      if (evt.button === 2) attack.play();
    };
  }

  async createZombie(scene = this.scene!) {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_death.glb",
      scene
    );

    this.zombieAnims = animationGroups;

    meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    meshes[0].position = new Vector3(-3, 0, 0);

    // death animation
    this.zombieAnims[0].stop();
    // idle animation
    this.zombieAnims[1].play(true);

    const deathAnim = this.zombieAnims[0].targetedAnimations[0].animation;

    const deathEvt = new AnimationEvent(
      150, // 150th frame
      () => {
        if (!this.cheer) throw new Error("cheer not initialized yet!");

        this.cheer.play(true);
      },
      false
    );
    deathAnim.addEvent(deathEvt);
  }
}
