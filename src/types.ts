export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type RGBA = RGB & {
  a: number;
};

export interface IPixelizer {
  pixelate(imageData: ImageData, pixelSize: number, palette?: RGB[]): ImageData;
  applyPalette(imageData: ImageData, palette: RGB[]): ImageData;
}

export interface IPaletteExtractor {
  extract(imageData: ImageData): RGB[];
}
