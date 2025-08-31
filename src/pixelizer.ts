// biome-ignore-all lint/style/noNonNullAssertion: The length of the ImageData.data array is
// always a multiple of 4, and since the loop increments by 4,
// access to indices i, i+1, and i+2 is always guaranteed to be safe.

import type { IPixelizer, RGB } from "./types";

export class Pixelizer implements IPixelizer {
  public pixelate(
    originalImageData: ImageData,
    pixelSize: number,
    palette?: RGB[],
  ): ImageData {
    if (pixelSize <= 1) return originalImageData;

    const { width, height, data } = originalImageData;

    const result = new ImageData(
      Math.floor(width / pixelSize),
      Math.floor(height / pixelSize),
    );

    for (let y = 0; y < result.height; y++) {
      for (let x = 0; x < result.width; x++) {
        const startX = x * pixelSize;
        const startY = y * pixelSize;
        const endX = Math.min(startX + pixelSize, width);
        const endY = Math.min(startY + pixelSize, height);

        let r = 0,
          g = 0,
          b = 0,
          a = 0;
        let pixelCount = 0;

        for (let i = startY; i < endY; i++) {
          for (let j = startX; j < endX; j++) {
            const index = (i * width + j) * 4;
            r += data[index]!;
            g += data[index + 1]!;
            b += data[index + 2]!;
            a += data[index + 3]!;
            pixelCount++;
          }
        }

        const avgR = r / pixelCount;
        const avgG = g / pixelCount;
        const avgB = b / pixelCount;
        const avgA = a / pixelCount;

        const resultIndex = (y * result.width + x) * 4;
        result.data[resultIndex] = avgR;
        result.data[resultIndex + 1] = avgG;
        result.data[resultIndex + 2] = avgB;
        result.data[resultIndex + 3] = avgA;
      }
    }

    return palette ? this.applyPalette(result, palette) : result;
  }

  public applyPalette(imageData: ImageData, palette: RGB[]): ImageData {
    if (palette.length === 0) return imageData;

    const { width, height, data } = imageData;
    const resultImageData = new ImageData(width, height);
    const resultData = resultImageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const currentPixelColor: RGB = {
        r: data[i]!,
        g: data[i + 1]!,
        b: data[i + 2]!,
      };

      let closestColor = palette[0]!;
      let minDistance = this.getColorDist(currentPixelColor, closestColor);

      for (let j = 1; j < palette.length; j++) {
        const distance = this.getColorDist(currentPixelColor, palette[j]!);
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = palette[j]!;
        }
      }

      resultData[i] = closestColor.r;
      resultData[i + 1] = closestColor.g;
      resultData[i + 2] = closestColor.b;
      resultData[i + 3] = 255;
    }

    return resultImageData;
  }

  private getColorDist(c1: RGB, c2: RGB): number {
    const rDiff = c1.r - c2.r;
    const gDiff = c1.g - c2.g;
    const bDiff = c1.b - c2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  }
}
