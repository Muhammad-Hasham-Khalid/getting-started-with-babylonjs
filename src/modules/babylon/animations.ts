import {
  CubeTexture,
  Scene,
  FreeCamera,
  Vector3,
  SceneLoader,
  AbstractMesh,
  Animation,
  Mesh,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class Animations extends BaseScene {
  camera?: FreeCamera;
  target?: AbstractMesh;

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

    const camera = new FreeCamera("camera", new Vector3(0, 2, -10), this.scene);
    camera.attachControl();
    camera.minZ = 0.5;

    this.camera = camera;

    return scene;
  };

  createEnvironment = async (scene = this.scene) => {
    if (!scene) {
      throw new Error("scene not initialized");
    }

    await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Prototype_Level_Simplified.glb",
      scene
    );

    await this.createTarget(scene);
  };

  async createTarget(scene: Scene = this.scene!) {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "target.glb",
      scene
    );

    meshes.shift(); // remove root mesh

    this.target = Mesh.MergeMeshes(
      meshes as Mesh[],
      true,
      true,
      undefined,
      false,
      true
    ) as AbstractMesh;

    this.target.position.y = 3;

    this.createAnimations(scene);
  }

  createAnimations(scene: Scene = this.scene!) {
    if (!this.target) {
      throw new Error("target not initialized");
    }

    const rotateFrames = [];
    const slideFrames = [];
    const fadeOutFrames = [];

    const fps = 60;
    const rotateAnim = new Animation(
      "rotateAnim",
      "rotation.z",
      fps,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const slideAnim = new Animation(
      "slideAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const fadeOutAnim = new Animation(
      "fadeOutAnim",
      "visibility",
      fps,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    rotateFrames.push({ frame: 0, value: 0 });
    rotateFrames.push({ frame: 180, value: Math.PI / 2 });

    slideFrames.push({ frame: 0, value: new Vector3(0, 3, 0) });
    slideFrames.push({ frame: 45, value: new Vector3(-3, 2, 0) });
    slideFrames.push({ frame: 90, value: new Vector3(0, 3, 0) });
    slideFrames.push({ frame: 135, value: new Vector3(3, 2, 0) });
    slideFrames.push({ frame: 180, value: new Vector3(0, 3, 0) });

    fadeOutFrames.push({ frame: 0, value: 1 });
    fadeOutFrames.push({ frame: 180, value: 0 });

    rotateAnim.setKeys(rotateFrames);
    slideAnim.setKeys(slideFrames);
    fadeOutAnim.setKeys(fadeOutFrames);

    this.target.animations.push(rotateAnim);
    this.target.animations.push(slideAnim);

    const onAnimationEnd = () => this.target?.setEnabled(false);
    const animCtrl = scene.beginAnimation(
      this.target,
      0,
      180,
      true,
      1,
      onAnimationEnd
    );

    // const animations = [slideAnim, rotateAnim];
    // scene.beginDirectAnimation(this.target, animations, 0, 180, true);

    scene.onPointerDown = async (event) => {
      if (!this.target) {
        throw new Error("target not initialized");
      }

      if (event.button === 2) {
        await scene
          .beginDirectAnimation(this.target, [fadeOutAnim], 0, 180)
          .waitAsync();

        animCtrl.stop();
      }
    };
  }
}
