import { Color3 } from "@babylonjs/core";

type TextureVariant = "ao" | "diff" | "nor" | "spec" | "arm";

type TextureName = "cobblestone" | "metal" | "asphalt";

export function getTextureUrl(name: TextureName, variant: TextureVariant) {
  return `textures/${name}/${name}_${variant}.jpg`;
}

export function sleep(time: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function getRandomColor() {
  const red = Math.random();
  const green = Math.random();
  const blue = Math.random();

  return new Color3(red, green, blue);
}
