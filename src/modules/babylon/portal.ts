import {
  ActionManager,
  CubeTexture,
  ExecuteCodeAction,
  FreeCamera,
  PointLight,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { BasicScene } from "./basic-scene";
import { CollisionsTriggers } from "./collisions-triggers";
import { CustomModels } from "./custom-models";
import { FirstPersonController } from "./first-person-controller";
import { BaseScene } from "./lib/base-scene";
import { LightsShadows } from "./lights-shadows";
import { MeshActions } from "./mesh-actions";
import { PBR } from "./PBR";
import { StandardMaterials } from "./standard-materials";

export class Portal extends BaseScene {
  initialize = async () => {
    this.engine.displayLoadingUI();
    this.scene = await this.createScene();

    await this.createPortalRoom();

    const doors = [
      new Vector3(-10, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(0, 0, 10),
      new Vector3(0, 0, -10),

      new Vector3(-Math.sqrt(50), 0, -Math.sqrt(50)),
      new Vector3(Math.sqrt(50), 0, Math.sqrt(50)),
      new Vector3(-Math.sqrt(50), 0, Math.sqrt(50)),
      new Vector3(Math.sqrt(50), 0, -Math.sqrt(50)),
    ];

    const scenes: typeof BaseScene[] = [
      CustomModels,
      BasicScene,
      MeshActions,
      PBR,
      StandardMaterials,
      LightsShadows,
      FirstPersonController,
      CollisionsTriggers,
    ];

    for (let i = 0; i < doors.length; i++) {
      const doorPosition = doors[i];

      const rotation = doorPosition.x !== 0 ? new Vector3(0, 90, 0) : undefined;

      await this.createPortalDoor(
        this.scene,
        scenes[i],
        doorPosition,
        rotation
      );
    }

    this.engine.hideLoadingUI();
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

  createPortalDoor = async <T extends typeof BaseScene>(
    scene = this.scene,
    NextScene: T,
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

    portalDoorModel.meshes[1].actionManager = new ActionManager(scene);
    portalDoorModel.meshes[1].actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickDownTrigger, async (evt) => {
        this.dispose();

        const canvas = document.querySelector("canvas")!;
        // TODO: find fix for the inherited class
        // @ts-ignore
        const scene = new NextScene(canvas);
        await scene.initialize();
      })
    );

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
