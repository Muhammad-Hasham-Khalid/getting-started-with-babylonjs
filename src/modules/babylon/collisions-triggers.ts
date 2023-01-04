import {
  AbstractMesh,
  CannonJSPlugin,
  Color3,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Nullable,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";
import * as CANNON from "cannon";
import { getRandomColor } from "./utils";

export class CollisionsTriggers extends BaseScene {
  sphere!: AbstractMesh;
  box!: AbstractMesh;
  ground!: AbstractMesh;

  createScene = () => {
    const scene = new Scene(this.engine);
    new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 10, -20),
      this.scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl();
    camera.minZ = 0.5;

    scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new CannonJSPlugin(true, 10, CANNON)
    );

    return scene;
  };

  createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Prototype_Level_Simplified.glb",
      this.scene
    );

    this.createImpostors();
    this.detectTrigger();
  };

  createImpostors() {
    this.ground = MeshBuilder.CreateGround("ground", {
      width: 40,
      height: 40,
    });

    this.ground.position = new Vector3(0, 0.25, 0);
    this.ground.isVisible = false; // true

    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 }
    );

    this.sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 });
    this.sphere.position = new Vector3(0, 8, 0);

    this.sphere.physicsImpostor = new PhysicsImpostor(
      this.sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 1, friction: 1 }
    );

    // this.box = MeshBuilder.CreateBox("box", { size: 2 });
    // this.box.position = new Vector3(0, 5, 0);

    // this.box.physicsImpostor = new PhysicsImpostor(
    //   this.box,
    //   PhysicsImpostor.BoxImpostor,
    //   { mass: 1, restitution: 1 }
    // );

    // this.sphere.physicsImpostor.registerOnPhysicsCollide(
    //   [this.box.physicsImpostor, this.ground.physicsImpostor],
    //   this.detectCollisions
    // );

    // this.sphere.physicsImpostor.unregisterOnPhysicsCollide(
    //   this.ground.physicsImpostor,
    //   this.detectCollisions
    // );

    // this.box.physicsImpostor.registerOnPhysicsCollide(
    //   this.sphere.physicsImpostor,
    //   this.detectCollisions
    // );

    // this.box.physicsImpostor.unregisterOnPhysicsCollide(
    //   this.ground.physicsImpostor,
    //   this.detectCollisions
    // );
  }

  detectCollisions(
    collider: PhysicsImpostor,
    collidedAgainst: PhysicsImpostor | PhysicsImpostor[],
    point: Nullable<Vector3>
  ) {
    const redMat = new StandardMaterial("redMat", this.scene);
    redMat.diffuseColor = getRandomColor();

    // collider is the box
    // collider.object.scaling = new Vector3(3, 3, 3);
    // collider.setScalingUpdated();

    if (Array.isArray(collidedAgainst)) {
      collidedAgainst.forEach((ca) => {
        (ca.object as AbstractMesh).material = redMat;
      });
    } else {
      (collidedAgainst.object as AbstractMesh).material = redMat;
    }
  }

  detectTrigger(scene = this.scene) {
    const box = MeshBuilder.CreateBox(
      "box",
      { width: 4, height: 1, depth: 4 },
      this.scene
    );

    let counter = 0;

    box.position.y = 0.5;
    box.visibility = 0.25;

    this.scene?.registerBeforeRender(() => {
      const intersects = box.intersectsMesh(this.sphere, true);
      if (intersects) counter++;
    });
  }
}
