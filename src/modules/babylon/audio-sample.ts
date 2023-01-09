import {
  AnimationEvent,
  CubeTexture,
  FreeCamera,
  Scene,
  SceneLoader,
  Sound,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { BaseScene } from "./lib/base-scene";

export class AudioSample extends BaseScene {
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

  createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Prototype_Level_Simplified.glb"
    );

    const backgroundMusic = new Sound(
      "backgroundMusic",
      "/audio/terror_ambience.mp3",
      this.scene,
      null,
      {
        volume: 0,
        autoplay: true,
      }
    );

    backgroundMusic.setVolume(0.75, 30);

    await this.createCharacter();
    await this.createZombie();
  };

  async createCharacter() {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "character_scared.glb"
    );

    meshes[0].rotate(Vector3.Up(), -Math.PI / 2);
    meshes[0].position = new Vector3(7, 0, 0);
  }

  async createZombie() {
    const { meshes, animationGroups } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "zombie_growl.glb"
    );
    meshes[0].rotate(Vector3.Up(), Math.PI / 2);
    meshes[0].position = new Vector3(-7, 0, 0);

    animationGroups[0].stop();

    const growlFx = new Sound("growlFx", "/audio/growl.mp3", this.scene, null, {
      spatialSound: true,
      maxDistance: 10,
    });

    //growlFx.attachToMesh(meshes[0])
    growlFx.setPosition(new Vector3(-7, 0, 0));
    growlFx.setPlaybackRate(1.87);

    const growlAnim = animationGroups[0].targetedAnimations[0].animation;

    const growlEvt = new AnimationEvent(
      70,
      () => {
        if (!growlFx.isPlaying) growlFx.play();
      },
      false
    );
    growlAnim.addEvent(growlEvt);
    animationGroups[0].play(true);
  }
}
