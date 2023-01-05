import {
  CannonJSPlugin,
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

export class PhysicsImposter extends BaseScene {
  createScene = (engine = this.engine) => {
    const scene = new Scene(engine);

    new HemisphericLight("hemiLight", new Vector3(0, 1, 0), this.scene!);

    const camera = new FreeCamera("camera", new Vector3(0, 10, -20), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl();
    camera.minZ = 0.5;

    scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new CannonJSPlugin(true, 10, CANNON)
    );

    this.createImposters();
    return scene;
  };

  createEnvironment = async () => {
    await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Prototype_Level_Simplified.glb",
      this.scene
    );
  };

  createImposters = async () => {
    const box = MeshBuilder.CreateBox("box", { size: 2 });
    box.position = new Vector3(0, 10, 1);
    box.rotation = new Vector3(Math.PI / 4, 0, 0);
    box.physicsImpostor = new PhysicsImpostor(
      box,
      PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 0.75 }
    );

    const ground = MeshBuilder.CreateGround("ground", {
      width: 40,
      height: 40,
    });

    ground.isVisible = false;
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.5 }
    );

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 3 });
    sphere.position = new Vector3(0, 6, 0);
    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.8 }
    );
  };
}
