import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import {
  CIRCUIT_BREAKER_CONSTANTS,
  FILE_UPLOAD_CONSTANTS,
} from '../../../common/constants';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import { CircuitBreaker } from '../../../common/utils';
import {
  ALLOWED_ALL_MIMETYPES,
  ALLOWED_AUDIO_MIMETYPES,
  ALLOWED_DOCUMENT_MIMETYPES,
  ALLOWED_IMAGE_MIMETYPES,
  ALLOWED_VIDEO_MIMETYPES,
  type AllowedAudioMimetype,
  type AllowedDocumentMimetype,
  type AllowedImageMimetype,
  type AllowedMimetype,
  type AllowedVideoMimetype,
} from '../constants';
import { UploadResourceTypeEnum } from '../enum';
import type { IUploadResult } from '../interfaces';
import { CloudinaryProvider } from './cloudinary.provider';
import { ImageOptimizationProvider } from './image-optimization.provider';

@Injectable()
export class UploadFileProvider {
  private readonly logger = new Logger(UploadFileProvider.name);
  private readonly MAX_FILE_SIZE = FILE_UPLOAD_CONSTANTS.MAX_FILE_SIZE_BYTES;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly imageOptimizationProvider: ImageOptimizationProvider,
  ) {
    this.circuitBreaker = new CircuitBreaker('CloudinaryService', {
      failureThreshold: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_FAILURE_THRESHOLD,
      successThreshold: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_SUCCESS_THRESHOLD,
      timeout: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_TIMEOUT,
      monitoringPeriod: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_MONITORING_PERIOD,
    });
  }

  async uploadFile(
    uploadedFile: Express.Multer.File,
    folder?: string,
    resourceType: UploadResourceTypeEnum = UploadResourceTypeEnum.AUTO,
  ): Promise<IUploadResult> {
    if (!uploadedFile || !uploadedFile.buffer) {
      throw new BadRequestException(responseMessage.upload.noFileProvided);
    }

    this.validateFileSize(uploadedFile.size);
    this.validateFileType(uploadedFile.mimetype, resourceType);

    try {
      const cloudinary = this.cloudinaryProvider.getCloudinary();

      const uploadOptions: UploadApiOptions = {
        folder: folder || FILE_UPLOAD_CONSTANTS.DEFAULT_UPLOAD_FOLDER,
        resource_type: resourceType,
      };

      let fileBuffer = uploadedFile.buffer;
      if (this.isImage(uploadedFile.mimetype)) {
        this.logger.log(
          `Optimizing image: ${uploadedFile.originalname} (${this.formatBytes(uploadedFile.size)})`,
        );
        fileBuffer = await this.imageOptimizationProvider.optimizeImage(
          uploadedFile.buffer,
          uploadedFile.mimetype,
        );
        this.logger.log(
          `Image optimized: ${this.formatBytes(fileBuffer.length)}`,
        );
      }

      const result = await this.circuitBreaker.execute(async () => {
        return new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) {
                reject(
                  new Error(
                    error.message ||
                      responseMessage.upload.uploadFailedWithError,
                  ),
                );
              } else if (result) {
                resolve(result);
              } else {
                reject(new Error(responseMessage.upload.uploadFailedNoResult));
              }
            },
          );

          const bufferStream = new Readable();
          bufferStream.push(fileBuffer);
          bufferStream.push(null);
          bufferStream.pipe(uploadStream);
        });
      });

      return this.formatUploadResult(result);
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.upload.uploadFailed,
      );
    }
  }

  private validateFileSize(size: number): void {
    if (!size || size <= 0) {
      throw new BadRequestException(responseMessage.upload.invalidFileSize);
    }

    if (size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(responseMessage.upload.fileTooLarge);
    }
  }

  private validateFileType(
    mimetype: string,
    resourceType: UploadResourceTypeEnum,
  ): void {
    if (!mimetype) {
      throw new BadRequestException(responseMessage.upload.invalidFileType);
    }

    const normalizedMimetype = mimetype.toLowerCase();

    switch (resourceType) {
      case UploadResourceTypeEnum.IMAGE:
        if (
          !ALLOWED_IMAGE_MIMETYPES.includes(
            normalizedMimetype as AllowedImageMimetype,
          )
        ) {
          throw new BadRequestException(
            responseMessage.upload.invalidImageType,
          );
        }
        break;

      case UploadResourceTypeEnum.VIDEO:
        if (
          !ALLOWED_VIDEO_MIMETYPES.includes(
            normalizedMimetype as AllowedVideoMimetype,
          )
        ) {
          throw new BadRequestException(
            responseMessage.upload.invalidVideoType,
          );
        }
        break;

      case UploadResourceTypeEnum.RAW: {
        const isValidRaw =
          ALLOWED_DOCUMENT_MIMETYPES.includes(
            normalizedMimetype as AllowedDocumentMimetype,
          ) ||
          ALLOWED_AUDIO_MIMETYPES.includes(
            normalizedMimetype as AllowedAudioMimetype,
          );
        if (!isValidRaw) {
          throw new BadRequestException(
            responseMessage.upload.invalidDocumentType,
          );
        }
        break;
      }

      case UploadResourceTypeEnum.AUTO:
      default:
        if (
          !ALLOWED_ALL_MIMETYPES.includes(normalizedMimetype as AllowedMimetype)
        ) {
          throw new BadRequestException(responseMessage.upload.invalidFileType);
        }
        break;
    }
  }

  private isImage(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = FILE_UPLOAD_CONSTANTS.BYTES_PER_KB;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  private formatUploadResult(result: UploadApiResponse): IUploadResult {
    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      format: result.format,
      resourceType: result.resource_type,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      createdAt: result.created_at,
    };
  }
}
