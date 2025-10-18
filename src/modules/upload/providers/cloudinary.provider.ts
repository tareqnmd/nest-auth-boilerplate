import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryField } from '../../../common/enum';
import type { ICloudinaryConfig } from '../interfaces';

@Injectable()
export class CloudinaryProvider {
  constructor(private readonly configService: ConfigService) {
    const config =
      this.configService.get<ICloudinaryConfig>('cloudinaryConfig');

    if (!config) {
      throw new Error('Cloudinary configuration is missing');
    }

    cloudinary.config({
      [CloudinaryField.CLOUD_NAME]: config[CloudinaryField.CLOUD_NAME],
      [CloudinaryField.API_KEY]: config[CloudinaryField.API_KEY],
      [CloudinaryField.API_SECRET]: config[CloudinaryField.API_SECRET],
    });
  }

  getCloudinary() {
    return cloudinary;
  }
}
