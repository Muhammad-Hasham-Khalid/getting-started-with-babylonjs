import {
  AbstractMesh,
  ActionManager,
  Color3,
  CubeTexture,
  FreeCamera,
  IncrementValueAction,
  InterpolateValueAction,
  PBRMaterial,
  Scene,
  SceneLoader,
  SetValueAction,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class MeshActions extends BaseScene {
  cube!: AbstractMesh;
  sphere!: AbstractMesh;
  cylinder!: AbstractMesh;
  sphereMat!: PBRMaterial;

  createScene = (engine = this.engine) => {
    const scene = new Scene(engine);

    new FreeCamera("camera", new Vector3(0, 0, -8), scene);

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "/environments/wide-street.env",
      scene
    );
    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true, 1000, 0.2, true);
    scene.environmentIntensity = 1.5;

    return scene;
  };

  createEnvironment = async () => {
    await this.createMeshes();
    this.createActions();
  };

  createMeshes = async (scene = this.scene) => {
    this.sphereMat = new PBRMaterial("sphereMat", this.scene);
    this.sphereMat.albedoColor = new Color3(1, 0, 0);
    this.sphereMat.roughness = 1;

    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "gifts.glb",
      scene
    );

    this.cube = meshes[1];
    this.sphere = meshes[2];
    this.cylinder = meshes[3];

    this.cylinder.rotation = new Vector3(-Math.PI / 4, 0, 0);
    this.sphere.material = this.sphereMat;
  };

  createActions = (scene = this.scene) => {
    if (!scene || !this.scene) {
      throw new Error("scene missing");
    }

    // action managers
    this.cube.actionManager = new ActionManager(scene);
    this.sphere.actionManager = new ActionManager(scene);
    this.scene.actionManager = new ActionManager(scene);

    // cube actions
    this.cube.actionManager.registerAction(
      new SetValueAction(
        ActionManager.OnPickDownTrigger,
        this.cube,
        "scaling",
        new Vector3(1.5, 1.5, 1.5)
      )
    );

    // sphere actions
    const RemoveRoughness = new InterpolateValueAction(
      ActionManager.OnPickDownTrigger,
      this.sphereMat,
      "roughness",
      0,
      3000 // duration
    );

    const AddRoughness = new InterpolateValueAction(
      ActionManager.NothingTrigger,
      this.sphereMat,
      "roughness",
      1,
      3000 // duration
    );

    this.sphere.actionManager
      .registerAction(RemoveRoughness)
      ?.then(AddRoughness);

    // cylinder actions
    this.scene.actionManager.registerAction(
      new IncrementValueAction(
        ActionManager.OnEveryFrameTrigger,
        this.cylinder,
        "rotation.x",
        -0.01
      )
    );
  };
}
