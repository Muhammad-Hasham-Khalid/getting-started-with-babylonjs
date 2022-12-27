import {
  CubeTexture,
  Engine,
  FreeCamera,
  MeshBuilder,
  PBRMaterial,
  Scene,
  SceneLoader,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";

export class CustomModels extends BaseScene {
  initialize = async () => {
    this.scene = this.createScene();

    // const barrel = await this.createBarrel();
    // const mainCamera = this.scene.getCameraByName("main-camera");
    // if (mainCamera && mainCamera instanceof FreeCamera) {
    //   mainCamera.target = barrel.meshes[1].getPositionInCameraSpace();
    // }

    await this.createCampsite();

    this.engine.runRenderLoop(this.render);
  };

  createScene = (engine: Engine = this.engine) => {
    const scene = new Scene(engine);

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "environments/wide-street.env",
      scene
    );

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex);
    scene.environmentIntensity = 0.5;

    // add camera
    const cameraPos = new Vector3(0, 1, -8);
    const camera = new FreeCamera("main-camera", cameraPos, scene);
    camera.attachControl();
    camera.speed = 0.5;

    return scene;
  };

  createGround = (scene = this.scene) => {
    // add ground
    const groundOptions = { width: 100, height: 100 };
    const ground = MeshBuilder.CreateGround("ground", groundOptions, scene);
    ground.material = this.createGroundMaterial();
  };

  createGroundMaterial = (scene = this.scene) => {
    const pbr = new PBRMaterial("pbr-ground", scene);
    pbr.albedoTexture = new Texture("textures/asphalt/asphalt_diff.jpg", scene);

    pbr.bumpTexture = new Texture("textures/asphalt/asphalt_nor.jpg", scene);

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    // using different channels
    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture(
      "textures/asphalt/asphalt_arm.jpg",
      scene
    );

    return pbr;
  };

  createBarrel = async (scene = this.scene) => {
    const barrelModel = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "barrel.glb",
      scene
    );

    const barrelMesh = barrelModel.meshes[1];
    barrelMesh.scaling = new Vector3(20, 20, 20);

    return barrelModel;
  };

  createCampsite = async (scene = this.scene) => {
    const campfireModel = await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "campfire.glb",
      scene
    );

    return campfireModel;
  };
}
