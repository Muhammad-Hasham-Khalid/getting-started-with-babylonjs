import {
  AmmoJSPlugin,
  CubeTexture,
  FreeCamera,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import Ammo from "ammojs-typed";
import { BaseScene } from "./lib/base-scene";
import { getRandomColor } from "./utils";

export class PhysicsForces extends BaseScene {
  camera?: FreeCamera;
  cannonball?: Mesh;
  interval?: NodeJS.Timer;
  ground?: Mesh;

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
      this.scene
    );

    await this.createPhysics();

    if (scene && scene.physicsEnabled) {
      this.createImpostors();
      this.interval = setInterval(() => {
        const x = Math.random() * 5;
        const y = Math.random() * 10 + 3;
        const z = Math.random() * 5;
        this.createImpulse(scene, new Vector3(x, y, z));
      }, 5000);
      this.createCannonball();

      scene.onPointerDown = (evt) => {
        // press mouse left click
        if (evt.button === 0) {
          if (!this.engine.isPointerLock) {
            this.engine.enterPointerlock();
          }
          this.shootCannonball();
        }

        // press mouse right click
        if (evt.button === 1) this.engine.exitPointerlock();

        // if (evt.button === 2) {}
      };
    } else {
      console.error("physics not enabled");
    }
  };

  async createPhysics(scene = this.scene) {
    if (!scene) {
      console.log("scene not initialized yet!");
    }

    const ammo = await Ammo();
    const physicsEngine = new AmmoJSPlugin(true, ammo);
    scene?.enablePhysics(new Vector3(0, -9.81, 0), physicsEngine);
  }

  createImpostors(scene = this.scene) {
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
      { mass: 0, restitution: 1 },
      scene
    );
    this.ground = ground;
  }

  createImpulse(scene = this.scene, position?: Vector3) {
    const box = MeshBuilder.CreateBox("box", { height: 4 }, scene);
    // box.position.y = 3;
    position ??= new Vector3(0, 3, 0);

    box.position.x = position.x;
    box.position.y = position.y;
    box.position.z = position.z;
    const boxMat = new PBRMaterial("boxMat", scene);
    boxMat.roughness = 1;

    boxMat.albedoColor = getRandomColor();
    box.material = boxMat;

    box.physicsImpostor = new PhysicsImpostor(
      box,
      PhysicsImpostor.BoxImpostor,
      { mass: 1, friction: 2 },
      scene
    );

    // box.actionManager = new ActionManager(scene);
    // box.actionManager.registerAction(
    //   new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (evt) => {
    //     box.physicsImpostor?.applyImpulse(
    //       new Vector3(0, 0, 5),
    //       box.getAbsolutePosition().add(new Vector3(0, 2, 0))
    //     );
    //   })
    // );
  }

  createCannonball(scene = this.scene) {
    if (!this.camera) {
      throw new Error("camera not initialized");
    }

    this.cannonball = MeshBuilder.CreateSphere(
      "cannonball",
      { diameter: 0.5 },
      scene
    );
    const ballMat = new PBRMaterial("ballMat", scene);
    ballMat.roughness = 1;
    ballMat.albedoColor = getRandomColor();

    this.cannonball.material = ballMat;
    this.cannonball.physicsImpostor = new PhysicsImpostor(
      this.cannonball,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1 },
      scene
    );

    this.cannonball.position = this.camera.position;
    this.cannonball.setEnabled(false);
  }

  shootCannonball(scene = this.scene): void {
    if (!scene) {
      throw new Error("scene not initialized");
    }

    if (!this.camera) {
      throw new Error("camera not initialized");
    }

    if (!this.ground || !this.ground.physicsImpostor) {
      throw new Error("ground not initialized");
    }

    if (!this.cannonball) {
      this.createCannonball();
      return this.shootCannonball();
    }

    const _cannonball = this.cannonball.clone("clone");
    _cannonball.position = this.camera.position;
    _cannonball.setEnabled(true);
    _cannonball.physicsImpostor?.applyForce(
      this.camera.getForwardRay().direction.scale(1000),
      _cannonball.getAbsolutePosition()
    );

    _cannonball.physicsImpostor?.registerOnPhysicsCollide(
      this.ground.physicsImpostor,
      () => {
        setTimeout(() => _cannonball.dispose(), 3000);
      }
    );
  }

  dispose() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    super.dispose();
  }
}
