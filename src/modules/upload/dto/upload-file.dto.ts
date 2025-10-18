import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UploadField } from '../../../common/enum';
import { UploadResourceTypeEnum } from '../enum';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  [UploadField.FILE]: Express.Multer.File;

  @ApiPropertyOptional({
    description: 'Folder path in Cloudinary',
    example: 'users/avatars',
  })
  @IsOptional()
  @IsString()
  [UploadField.FOLDER]?: string;

  @ApiPropertyOptional({
    enum: UploadResourceTypeEnum,
    description: 'Type of resource to upload',
    default: UploadResourceTypeEnum.AUTO,
  })
  @IsOptional()
  @IsEnum(UploadResourceTypeEnum)
  [UploadField.RESOURCE_TYPE]?: UploadResourceTypeEnum;
}
