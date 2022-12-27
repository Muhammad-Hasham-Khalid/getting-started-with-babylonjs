import {
  CubeTexture,
  FreeCamera,
  MeshBuilder,
  PBRMaterial,
  Scene,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { pbrVertexDeclaration } from "@babylonjs/core/Shaders/ShadersInclude/pbrVertexDeclaration";
import { BaseScene } from "./lib/base-scene";

export class PBR extends BaseScene {
  createScene = (engine = this.engine) => {
    const scene = new Scene(engine);

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "environments/wide-street.env",
      scene
    );

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex);

    // add camera
    const cameraPos = new Vector3(-90, 50, -90);
    const camera = new FreeCamera("camera", cameraPos, scene);
    camera.attachControl();
    camera.speed = 1;

    // add hemispheric light
    // const hLightPos = new Vector3(0, 1, 0);
    // const hLight = new HemisphericLight("hLight", hLightPos, scene);

    // add ground
    const groundOptions = { width: 100, height: 100 };
    const ground = MeshBuilder.CreateGround(
      "ground",
      groundOptions,
      this.scene
    );
    ground.material = this.createGroundMaterial();

    // add ball
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 6 }, this.scene);
    ball.position = new Vector3(0, 3, 0);
    ball.material = this.createBallMaterial(this.scene);

    // make the camera to focus the ball
    camera.target = ball.position;

    return scene;
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

  createBallMaterial = (scene = this.scene) => {
    const pbr = new PBRMaterial("pbr-ball", scene);

    return pbr;
  };
}
