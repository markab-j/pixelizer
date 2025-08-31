# @markab-j/pixelizer

@markab-j/pixelizer는 이미지 데이터를 픽셀화하고, 이미지에서 색상 팔레트를 추출하거나 특정 팔레트를 이미지에 적용하는 기능을 제공하는 라이브러리입니다.

---

## Installation

```bash
npm install @markab-j/pixelizer
```

or

```bash
bun install @markab-j/pixelizer
```

---

## Quick Example

```typescript
import { Pixelizer } from '@markab-j/pixelizer';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const image = new Image();
image.src = 'path/to/your/image.png';

image.onload = () => {
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const pixelizer = new Pixelizer();
  const pixelatedImageData = pixelizer.pixelate(imageData, 10, palette);

  ctx.putImageData(pixelatedImageData, 0, 0);
};
```

---

## Documentation

### Pixelizer
ImageData를 픽셀화하거나 팔레트를 적용하는 클래스입니다.

#### `pixelate(imageData: ImageData, pixelSize: number, palette?: RGB[]): ImageData`

`ImageData`를 주어진 `pixelSize`에 따라 픽셀화합니다. 

선택적으로 palette(from `PaletteExtractor`)를 제공하여 해당 팔레트의 색상으로 픽셀을 채울 수 있습니다.

- imageData: [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) 객체
- pixelSize: 픽셀화할 블록의 크기 (정수).
- palette (선택 사항): 적용할 RGB 색상 배열.
- 반환값: 픽셀화된 새로운 ImageData 객체.

Example.
```typescript
import { Pixelizer } from '@markab-j/pixelizer';

const pixelizer = new Pixelizer();
const imageData: ImageData = ctx.getImageData(0, 0, 100, 100);
const pixelSize = 8;

const pixelatedImage: ImageData = pixelizer.pixelate(imageData, pixelSize);
ctx.putImageData(pixelatedImage, 0, 0);
```

---
#### `applyPalette(imageData: ImageData, palette: RGB[]): ImageData`

ImageData의 각 픽셀을 주어진 palette에서 가장 가까운 색상으로 변경합니다.
- imageData:  [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) 객체
- palette: 적용할 RGB 색상 배열. 
- 반환값: 색상 팔레트가 적용된 새로운 ImageData 객체.

Example.
```typescript
import { Pixelizer } from '@markab-j/pixelizer';
import type { RGB } from '@markab-j/pixelizer';

const pixelizer = new Pixelizer();
const imageData: ImageData = ctx.getImageData(0, 0, 100, 100);
const customPalette: RGB[] = [
  { r: 255, g: 0, b: 0 },    // Red
  { r: 0, g: 0, b: 255 },    // Blue
  { r: 255, g: 255, b: 0 }, // Yellow
];

const newImage: ImageData = pixelizer.applyPalette(imageData, customPalette);
ctx.putImageData(newImage, 0, 0);
```

---
### PaletteExtractor

ImageData로부터 색상 팔레트를 추출하는 클래스입니다.

#### `extract(imageData: ImageData): RGB[]`

주어진 ImageData에 존재하는 픽셀을 그대로 추출하여 구성된 중복없는 RGB[]를 반환합니다.
- imageData: [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) 객체
- 반환값: { r: number; g: number; b: number; } 형태의 객체 배열.

Example.
```typescript
import { PaletteExtractor } from '@markab-j/pixelizer';
import type { RGB } from '@markab-j/pixelizer';

const paletteExtractor = new PaletteExtractor();

// imageData는 Canvas의 getImageData() 메소드로 얻을 수 있습니다.
const imageData: ImageData = ctx.getImageData(0, 0, 100, 100);

const colorPalette: RGB[] = paletteExtractor.extract(imageData);
console.log(colorPalette);
// [{ r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }, ...]
```

---

### Types
라이브러리에서 사용되는 주요 타입입니다.
```typescript
type RGB = {
    r: number;
    g: number;
    b: number;
};

type RGBA = RGB & {
    a: number;
};
```