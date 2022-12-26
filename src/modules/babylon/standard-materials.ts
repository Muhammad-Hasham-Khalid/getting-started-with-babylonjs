import {
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { BaseScene } from "./lib/base-scene";
import { getTextureUrl } from "./utils";

export class StandardMaterials extends BaseScene {
  createScene(engine: Engine = this.engine) {
    const scene = new Scene(engine);

    // add camera
    const cameraPos = new Vector3(-50, 20, -20);
    const camera = new FreeCamera("camera", cameraPos, scene);
    camera.attachControl();
    camera.speed = 0.25;

    // add hemispheric light
    const hLightPos = new Vector3(0, 1, 0);
    const hLight = new HemisphericLight("hLight", hLightPos, scene);
    hLight.intensity = 1;

    // add ground
    const groundSize = { width: 100, height: 100 };
    const ground = MeshBuilder.CreateGround("ground", groundSize, scene);
    ground.material = this.createGroundMaterial();

    // add ball
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 6 }, scene);
    ball.position = new Vector3(0, 3, 0);
    ball.material = this.createBallMaterial();

    // make the camera look at the ball
    camera.target = ball.position;

    return scene;
  }

  createGroundMaterial() {
    const groundMat = new StandardMaterial("groundMat");

    const uScale = 3;
    const vScale = 3;

    const textures = [];

    const diffuseTex = new Texture(
      getTextureUrl("cobblestone", "diff"),
      this.scene
    );
    groundMat.diffuseTexture = diffuseTex;
    textures.push(diffuseTex);

    const aoTex = new Texture(getTextureUrl("cobblestone", "ao"), this.scene);
    groundMat.ambientTexture = aoTex;
    textures.push(aoTex);

    const normalTex = new Texture(
      getTextureUrl("cobblestone", "nor"),
      this.scene
    );
    groundMat.bumpTexture = normalTex;
    textures.push(normalTex);

    const specTex = new Texture(
      getTextureUrl("cobblestone", "spec"),
      this.scene
    );
    groundMat.specularTexture = specTex;
    textures.push(specTex);

    textures.forEach((texture) => {
      texture.uScale = uScale;
      texture.vScale = vScale;
    });

    return groundMat;
  }

  createBallMaterial() {
    const ballMat = new StandardMaterial("ballMat");

    const uScale = 2;
    const vScale = 2;

    const textures = [];

    const diffuseTex = new Texture(getTextureUrl("metal", "diff"), this.scene);
    ballMat.diffuseTexture = diffuseTex;
    textures.push(diffuseTex);

    const normalTex = new Texture(getTextureUrl("metal", "nor"), this.scene);
    ballMat.bumpTexture = normalTex;
    ballMat.invertNormalMapX = true;
    ballMat.invertNormalMapY = true;
    textures.push(normalTex);

    const aoTex = new Texture(getTextureUrl("metal", "ao"), this.scene);
    ballMat.ambientTexture = aoTex;
    textures.push(aoTex);

    const specTex = new Texture(getTextureUrl("metal", "spec"), this.scene);
    ballMat.specularTexture = specTex;
    ballMat.specularPower = 10;
    textures.push(specTex);

    textures.forEach((texture) => {
      texture.uScale = uScale;
      texture.vScale = vScale;
    });

    return ballMat;
  }
}
