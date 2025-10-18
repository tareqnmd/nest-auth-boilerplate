import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserField } from '../../../common/enum';
import { AttachmentFolderEnum } from '../../../common/enum/attachment-folder.enum';
import { UploadService } from '../../upload/providers/upload.service';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class UpdateUserImageProvider {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly uploadService: UploadService,
  ) {}

  async updateUserImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<string | null> {
    const uploadedFile = await this.uploadService.uploadFile(
      file,
      AttachmentFolderEnum.USER_AVATARS,
    );
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        [UserField.IMAGE]: uploadedFile.secureUrl,
      },
      {
        new: true,
      },
    );
    return user?.[UserField.IMAGE] || null;
  }
}
