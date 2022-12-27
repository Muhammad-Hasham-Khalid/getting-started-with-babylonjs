import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  SceneLoader,
  AbstractMesh,
  GlowLayer,
  LightGizmo,
  GizmoManager,
  Light,
  Color3,
  DirectionalLight,
  PointLight,
  SpotLight,
  ShadowGenerator,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { BaseScene } from "./lib/base-scene";

export class LightsShadows extends BaseScene {
  lightTubes!: AbstractMesh[];
  models!: AbstractMesh[];
  ball!: AbstractMesh;

  initialize = async () => {
    this.scene = await this.createScene();

    await this.createEnvironment();
    this.createLights();

    this.engine.runRenderLoop(this.render);
  };

  createScene = () => {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -4), this.scene);
    camera.attachControl();
    camera.speed = 0.2;

    return scene;
  };

  createEnvironment = async () => {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "LightingScene.glb"
    );

    this.models = meshes;

    this.lightTubes = meshes.filter(
      (mesh) =>
        mesh.name === "lightTube_left" || mesh.name === "lightTube_right"
    );

    this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);

    this.ball.position = new Vector3(0, 1, -1);

    const glowLayer = new GlowLayer("glowLayer", this.scene);
    glowLayer.intensity = 0.75;
  };

  createLights = (scene = this.scene) => {
    if (!scene) {
      throw new Error("scene not initialized yet.");
    }

    // HEMISPHERIC LIGHT
    // const hemiLight = new HemisphericLight(
    //   "hemiLight",
    //   new Vector3(0, 1, 0),
    //   scene
    // );

    // hemiLight.diffuse = new Color3(1, 0, 0); // red
    // hemiLight.groundColor = new Color3(0, 0, 1); // blue
    // hemiLight.specular = new Color3(0, 1, 0); // green

    // DIRECTIONAL LIGHT
    // const dirLight = new DirectionalLight(
    //   "dirLight",
    //   new Vector3(0, -10, 0),
    //   scene
    // );

    // POINT LIGHT
    // const pointLight = new PointLight(
    //   "pointLight",
    //   new Vector3(0, 1, 0),
    //   scene
    // );

    // const colors = [172, 246, 250].map((each) => each / 255);
    // pointLight.diffuse = new Color3(...colors);
    // pointLight.intensity = 0.5;

    // const pointLightClone = pointLight.clone("pointLightClone") as PointLight;

    // pointLight.parent = this.lightTubes[0];
    // pointLightClone.parent = this.lightTubes[1];

    // SPOTLIGHT
    const spotlight = new SpotLight(
      "spotlight",
      new Vector3(0, 0.5, -3),
      new Vector3(0, 1, 3),
      Math.PI / 2,
      10,
      scene
    );
    spotlight.intensity = 100;
    spotlight.shadowEnabled = true;
    spotlight.shadowMaxZ = 100;
    spotlight.shadowMinZ = 1;

    const shadowGenerator = new ShadowGenerator(1024, spotlight);
    shadowGenerator.useBlurCloseExponentialShadowMap = true;

    this.ball.receiveShadows = true;
    shadowGenerator.addShadowCaster(this.ball);

    this.models.forEach((model) => {
      model.receiveShadows = true;
      shadowGenerator.addShadowCaster(model);
    });

    // this.createGizmos(spotlight);
  };

  createGizmos(customLight: Light, scene = this.scene): void {
    if (!scene) {
      throw new Error("scene not initialized yet.");
    }

    const lightGizmo = new LightGizmo();
    lightGizmo.scaleRatio = 2;
    lightGizmo.light = customLight;

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);
  }
}
