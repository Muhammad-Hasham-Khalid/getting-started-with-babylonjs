import {
  AbstractMesh,
  ActionManager,
  CannonJSPlugin,
  CubeTexture,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";
import * as CANNON from "cannon";

let gameOver = false;

export class PhysicsVelocity extends BaseScene {
  sphere?: AbstractMesh;
  box?: AbstractMesh;
  ground?: AbstractMesh;
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

    const camera = new FreeCamera("camera", new Vector3(0, 2, -5), this.scene);
    camera.attachControl();
    camera.minZ = 0.5;

    this.camera = camera;

    scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new CannonJSPlugin(true, 10, CANNON)
    );

    return scene;
  };

  createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Prototype_Level_Simplified.glb",
      this.scene
    );

    this.createImpostors();
    await this.createRocket();
  };

  createImpostors = () => {
    const ground = MeshBuilder.CreateGround("ground", {
      width: 40,
      height: 40,
    });

    ground.isVisible = false;

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 },
      this.scene
    );
  };

  async createRocket() {
    if (!this.scene || !this.camera) {
      throw new Error("scene or camera not found");
    }

    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "toon_rocket.glb",
      this.scene
    );

    const rocketCollider = MeshBuilder.CreateBox("rocketCollider", {
      width: 1,
      height: 1.7,
      depth: 1,
    });

    rocketCollider.position.y = 0.85;
    rocketCollider.visibility = 0;

    rocketCollider.physicsImpostor = new PhysicsImpostor(
      rocketCollider,
      PhysicsImpostor.BoxImpostor,
      { mass: 1 },
      this.scene
    );

    meshes[0].setParent(rocketCollider);

    rocketCollider.rotate(Vector3.Forward(), Math.PI / 2);

    const rocketPhysics = () => {
      if (!this.camera) {
        throw new Error("camera not found");
      }

      this.camera.position.x = rocketCollider.position.x;
      this.camera.position.y = rocketCollider.position.y;
      this.camera.position.z = rocketCollider.position.z - 5;

      rocketCollider.physicsImpostor?.setLinearVelocity(
        rocketCollider.up.scale(5)
      );

      rocketCollider.physicsImpostor?.setAngularVelocity(rocketCollider.up);
    };

    if (!gameOver) this.scene.registerBeforeRender(rocketPhysics);

    this.scene.onPointerDown = () => {
      gameOver = true;
      this.scene?.unregisterBeforeRender(rocketPhysics);
    };
  }

  dispose() {
    super.dispose();
  }
}
