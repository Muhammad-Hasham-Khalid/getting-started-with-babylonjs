import {
  Animation,
  AnimationGroup,
  CubeTexture,
  FreeCamera,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class CutScene extends BaseScene {
  characterAnimations?: AnimationGroup[];
  camera?: FreeCamera;

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

    this.camera = new FreeCamera("camera", new Vector3(10, 2, -10), scene);
    this.camera.minZ = 0.5;
    this.camera.speed = 0.5;

    // this.camera.attachControl();

    return scene;
  };

  createEnvironment = async (scene = this.scene) => {
    if (!this.scene) {
      throw new Error("scene not initialized yet");
    }
    await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Prototype_Level_Simplified.glb"
    );
    await this.createCharacter(scene);
    await this.createZombies(scene);
    await this.createCutscene(scene);
  };

  async createCharacter(scene: Scene = this.scene!) {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Character.glb"
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(8, 0, -4);

    this.characterAnimations = animationGroups;

    this.characterAnimations[0].stop();
    this.characterAnimations[1].play();
  }

  async createZombies(scene: Scene = this.scene!) {
    const zombieOne = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_1.glb"
    );

    const zombieTwo = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "zombie_2.glb"
    );

    zombieOne.meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    zombieOne.meshes[0].position = new Vector3(-8, 0, -4);
    zombieTwo.meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    zombieTwo.meshes[0].position = new Vector3(-6, 0, -2);
  }

  async createCutscene(scene: Scene = this.scene!) {
    if (!this.camera) {
      throw new Error("camera not initialized yet");
    }

    const camKeys = [];
    const fps = 60;
    const camAnim = new Animation(
      "camAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    camKeys.push({ frame: 0, value: new Vector3(10, 2, -10) });
    camKeys.push({ frame: 5 * fps, value: new Vector3(-6, 2, -10) });
    camKeys.push({ frame: 8 * fps, value: new Vector3(-6, 2, -10) });
    camKeys.push({ frame: 12 * fps, value: new Vector3(0, 3, -16) });

    camAnim.setKeys(camKeys);

    this.camera.animations.push(camAnim);

    scene
      .beginAnimation(this.camera, 0, 12 * fps)
      .waitAsync()
      .then(() => {
        this.endCutscene();
      });
  }

  endCutscene(): void {
    if (!this.camera) {
      throw new Error("camera not initialized yet");
    }

    this.camera.attachControl();

    if (this.characterAnimations) {
      this.characterAnimations[1].stop();
      this.characterAnimations[0].play();
    }
  }
}
