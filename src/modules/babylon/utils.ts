type TextureVariant = "ao" | "diff" | "nor" | "spec" | "arm";

type TextureName = "cobblestone" | "metal" | "asphalt";

export function getTextureUrl(name: TextureName, variant: TextureVariant) {
  return `textures/${name}/${name}_${variant}.jpg`;
}

export function sleep(time: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
