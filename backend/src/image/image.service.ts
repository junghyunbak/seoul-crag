import { Injectable } from '@nestjs/common';

import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async compressImage(imagePath: string, filename: string) {
    const resizedImageUrl = `/uploads/resized-${filename}`;

    await sharp(imagePath)
      .rotate()
      .resize({ width: 1024 })
      .jpeg({ quality: 80 })
      .toFile(`.${resizedImageUrl}`);

    return resizedImageUrl;
  }
}
