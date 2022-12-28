import {
  CubeTexture,
  FreeCamera,
  PointLight,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class Portal extends BaseScene {
  initialize = async () => {
    this.scene = await this.createScene();

    await this.createPortalRoom();

    const doors = [
      new Vector3(-10, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(0, 0, 10),
      new Vector3(0, 0, -10),
    ];

    for (let i = 0; i < doors.length; i++) {
      const doorPosition = doors[i];

      const rotation = doorPosition.x !== 0 ? new Vector3(0, 90, 0) : undefined;

      await this.createPortalDoor(this.scene, doorPosition, rotation);
    }

    this.engine.runRenderLoop(this.render);
  };

  createScene = () => {
    const scene = new Scene(this.engine);

    const cubeTex = CubeTexture.CreateFromPrefilteredData(
      "/environments/mountains.env",
      scene
    );

    scene.environmentTexture = cubeTex;
    scene.createDefaultSkybox(cubeTex);

    // add camera
    const cameraPos = new Vector3(0, 1, -15);
    const camera = new FreeCamera("camera", cameraPos, scene);
    camera.attachControl();
    camera.speed = 0.3;

    camera.keysUpward = [32]; // spacebar for upward
    camera.keysDownward = [17]; // left ctrl for downward
    camera.keysRotateLeft = [65];
    camera.keysRotateRight = [68];

    return scene;
  };

  createPortalRoom = async (scene = this.scene) => {
    const portalRoomModel = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "PortalRoomSmall.glb",
      scene
    );
    portalRoomModel.meshes[0].scaling = new Vector3(20, 20, 20);

    return portalRoomModel;
  };

  createPortalDoor = async (
    scene = this.scene,
    position?: Vector3,
    rotation?: Vector3
  ) => {
    const portalDoorModel = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "PortalDoor.glb",
      scene
    );

    portalDoorModel.meshes[0].receiveShadows = false;

    if (position) {
      portalDoorModel.meshes[0].position = position;
    }

    if (rotation) {
      portalDoorModel.meshes[0].rotation = rotation;
    }

    return portalDoorModel;
  };

  createPointLight = async (scene = this.scene, position: Vector3) => {
    if (!scene) {
      throw new Error("scene not initialized yet.");
    }

    const pointLight = new PointLight("pointLight", position, scene);
    return pointLight;
  };
}
