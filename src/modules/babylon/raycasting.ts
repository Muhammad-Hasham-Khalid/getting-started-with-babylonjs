import {
  AmmoJSPlugin,
  CubeTexture,
  FreeCamera,
  Matrix,
  MeshBuilder,
  PBRMaterial,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";
import Ammo from "ammojs-typed";
import { getRandomColor } from "./utils";

export class RayCasting extends BaseScene {
  camera?: FreeCamera;
  splatters: PBRMaterial[] = [];

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
    await SceneLoader.ImportMeshAsync(
      "",
      "/models/",
      "Prototype_Level_Simplified.glb",
      scene
    );

    await this.createPhysics(scene);
    this.createTextures();
    this.createPickingRay();
  };

  async createPhysics(scene = this.scene) {
    if (!scene) {
      console.log("scene not initialized yet!");
    }

    const ammo = await Ammo();
    const physicsEngine = new AmmoJSPlugin(true, ammo);
    scene?.enablePhysics(new Vector3(0, -9.81, 0), physicsEngine);

    await this.createImpostors(scene);
  }

  async createImpostors(scene = this.scene) {
    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 40,
        height: 40,
      },
      scene
    );

    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 10 },
      scene
    );

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 }, scene);
    const sphereMat = new PBRMaterial("sphereMat", scene);
    sphereMat.roughness = 1;
    sphereMat.albedoColor = getRandomColor();

    sphere.material = sphereMat;
    sphere.position.y = 3;
    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 20, friction: 1 },
      scene
    );
  }

  async createTextures(scene = this.scene) {
    const textures = ["blue", "orange", "green"];

    textures.forEach((textureName) => {
      const material = new PBRMaterial(textureName, scene);
      material.roughness = 1;
      material.albedoTexture = new Texture(
        `/textures/${textureName}.png`,
        scene
      );
      material.albedoTexture.hasAlpha = true;
      material.zOffset = -0.25;
      this.splatters.push(material);
    });
  }

  createPickingRay(scene = this.scene) {
    if (!scene) {
      throw new Error("scene not initialized");
    }

    scene.onPointerDown = () => {
      if (!this.camera) {
        throw new Error("camera not initialized");
      }

      const ray = scene?.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        this.camera
      );

      const raycastHit = scene.pickWithRay(ray);

      if (raycastHit?.hit && raycastHit.pickedMesh?.name === "sphere") {
        const decal = MeshBuilder.CreateDecal("decal", raycastHit.pickedMesh, {
          position: raycastHit.pickedPoint!,
          normal: raycastHit.getNormal(true)!,
          size: new Vector3(1, 1, 1),
        });

        const randomIdx = Math.floor(Math.random() * this.splatters.length);
        decal.material = this.splatters[randomIdx];

        decal.setParent(raycastHit.pickedMesh);

        raycastHit.pickedMesh.applyImpulse(
          ray.direction,
          raycastHit.pickedPoint!
        );
      }
    };
  }
}
