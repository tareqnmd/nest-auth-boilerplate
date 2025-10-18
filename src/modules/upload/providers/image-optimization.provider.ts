import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { IMAGE_CONSTANTS } from '../../../common/constants';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

@Injectable()
export class ImageOptimizationProvider {
  private readonly logger = new Logger(ImageOptimizationProvider.name);

  async optimizeImage(
    buffer: Buffer,
    mimetype: string,
    options: ImageOptimizationOptions = {},
  ): Promise<Buffer> {
    try {
      if (!this.isImage(mimetype)) {
        return buffer;
      }

      const {
        maxWidth = IMAGE_CONSTANTS.DEFAULT_MAX_WIDTH,
        maxHeight = IMAGE_CONSTANTS.DEFAULT_MAX_HEIGHT,
        quality = IMAGE_CONSTANTS.DEFAULT_QUALITY,
        format,
      } = options;

      let image = sharp(buffer);

      const metadata = await image.metadata();
      this.logger.log(
        `Optimizing image: ${metadata.format}, ${metadata.width}x${metadata.height}`,
      );

      if (
        metadata.width &&
        metadata.height &&
        (metadata.width > maxWidth || metadata.height > maxHeight)
      ) {
        image = image.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
        this.logger.log(
          `Resizing image to fit within ${maxWidth}x${maxHeight}`,
        );
      }

      image = image.rotate();

      if (format === 'jpeg' || metadata.format === 'jpeg') {
        image = image.jpeg({ quality, mozjpeg: true });
      } else if (format === 'png' || metadata.format === 'png') {
        image = image.png({
          quality,
          compressionLevel: IMAGE_CONSTANTS.PNG_COMPRESSION_LEVEL,
        });
      } else if (format === 'webp' || metadata.format === 'webp') {
        image = image.webp({ quality });
      } else {
        image = image.jpeg({ quality, mozjpeg: true });
      }

      const optimizedBuffer = await image.toBuffer();

      const originalSize = buffer.length;
      const optimizedSize = optimizedBuffer.length;
      const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

      this.logger.log(
        `Image optimized: ${this.formatBytes(originalSize)} → ${this.formatBytes(optimizedSize)} (${reduction}% reduction)`,
      );

      return optimizedBuffer;
    } catch (error) {
      this.logger.error('Image optimization failed:', error);
      return buffer;
    }
  }

  private isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = IMAGE_CONSTANTS.BYTES_PER_KB;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
