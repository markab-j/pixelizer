// biome-ignore-all lint/style/noNonNullAssertion: The length of the ImageData.data array is
// always a multiple of 4, and since the loop increments by 4,
// access to indices i, i+1, and i+2 is always guaranteed to be safe.

import type { IPaletteExtractor, RGB } from "./types.ts";

export class PaletteExtractor implements IPaletteExtractor {
  extract(imageData: ImageData): RGB[] {
    const { data, width, height } = imageData;

    if (width < 0 || height < 0) return [];

    const palette: RGB[] = [];
    const uniqueColors = new Set<string>();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;

      const colorKey = `${r},${g},${b}`;

      if (uniqueColors.has(colorKey)) continue;

      if (palette.length >= 256) {
        console.warn("palette is full. (max: 256)");
        break;
      }

      uniqueColors.add(colorKey);
      palette.push({ r, g, b });
    }

    return palette;
  }
}
