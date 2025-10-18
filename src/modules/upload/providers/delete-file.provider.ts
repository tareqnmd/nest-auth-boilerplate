import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import type { IDeleteResult } from '../interfaces';
import { CloudinaryProvider } from './cloudinary.provider';

@Injectable()
export class DeleteFileProvider {
  private readonly logger = new Logger(DeleteFileProvider.name);

  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}

  async deleteFile(publicId: string): Promise<IDeleteResult> {
    if (!publicId) {
      throw new BadRequestException(responseMessage.upload.publicIdRequired);
    }

    try {
      const cloudinary = this.cloudinaryProvider.getCloudinary();
      const response = (await cloudinary.uploader.destroy(
        publicId,
      )) as unknown as IDeleteResult;

      if (response.result !== 'ok') {
        throw new BadRequestException(responseMessage.upload.deleteFileFailed);
      }

      return response;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.upload.deleteFileFailed,
      );
    }
  }
}
