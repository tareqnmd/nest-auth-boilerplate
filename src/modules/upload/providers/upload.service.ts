import { Injectable, Logger } from '@nestjs/common';
import { UploadResourceTypeEnum } from '../enum';
import type {
  IDeleteResult,
  IMultiUploadResult,
  IUploadResult,
} from '../interfaces';
import { DeleteFileProvider } from './delete-file.provider';
import { UploadFileProvider } from './upload-file.provider';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly uploadFileProvider: UploadFileProvider,
    private readonly deleteFileProvider: DeleteFileProvider,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
    resourceType?: UploadResourceTypeEnum,
  ): Promise<IUploadResult> {
    return this.uploadFileProvider.uploadFile(file, folder, resourceType);
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
    resourceType?: UploadResourceTypeEnum,
  ): Promise<IMultiUploadResult> {
    this.logger.log(`Starting upload of ${files.length} files`);

    const uploadPromises = files.map((file) =>
      this.uploadFileProvider
        .uploadFile(file, folder, resourceType)
        .then((result) => ({
          status: 'fulfilled' as const,
          value: result,
          file,
        }))
        .catch((error: Error) => ({
          status: 'rejected' as const,
          reason: error,
          file,
        })),
    );

    const results = await Promise.all(uploadPromises);

    const successful: IUploadResult[] = [];
    const failed: { fileName: string; error: string }[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push({
          fileName: result.file.originalname,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : 'Unknown error occurred',
        });
        this.logger.warn(
          `Failed to upload file ${result.file.originalname}: ${result.reason instanceof Error ? result.reason.message : 'Unknown error'}`,
        );
      }
    }

    this.logger.log(
      `Upload completed: ${successful.length} successful, ${failed.length} failed`,
    );

    return {
      successful,
      failed,
      totalFiles: files.length,
      successCount: successful.length,
      failureCount: failed.length,
    };
  }

  async deleteFile(publicId: string): Promise<IDeleteResult> {
    return this.deleteFileProvider.deleteFile(publicId);
  }
}
