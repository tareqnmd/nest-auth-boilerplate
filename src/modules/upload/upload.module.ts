import { Module } from '@nestjs/common';
import {
  CloudinaryProvider,
  DeleteFileProvider,
  ImageOptimizationProvider,
  UploadFileProvider,
  UploadService,
} from './providers';

@Module({
  controllers: [],
  providers: [
    UploadService,
    CloudinaryProvider,
    UploadFileProvider,
    DeleteFileProvider,
    ImageOptimizationProvider,
  ],
  exports: [UploadService],
})
export class UploadModule {}
