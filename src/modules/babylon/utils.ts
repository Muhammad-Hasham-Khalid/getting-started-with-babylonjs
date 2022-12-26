type TextureVariant = "ao" | "diff" | "nor" | "spec";

type TextureName = "cobblestone" | "metal";

export function getTextureUrl(name: TextureName, variant: TextureVariant) {
  return `textures/${name}/${name}_${variant}.jpg` as const;
}
