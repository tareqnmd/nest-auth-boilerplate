import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonField, UploadField } from '../../../common/enum';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Public ID of the uploaded file',
    example: 'users/avatars/abc123',
  })
  [UploadField.PUBLIC_ID]: string;

  @ApiProperty({
    description: 'URL of the uploaded file',
    example:
      'http://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  [UploadField.URL]: string;

  @ApiProperty({
    description: 'Secure URL (HTTPS) of the uploaded file',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  [UploadField.SECURE_URL]: string;

  @ApiProperty({
    description: 'File format',
    example: 'jpg',
  })
  [UploadField.FORMAT]: string;

  @ApiProperty({
    description: 'Resource type',
    example: 'image',
  })
  [UploadField.RESOURCE_TYPE]: string;

  @ApiPropertyOptional({
    description: 'Width of the image in pixels',
    example: 1920,
  })
  [UploadField.WIDTH]?: number;

  @ApiPropertyOptional({
    description: 'Height of the image in pixels',
    example: 1080,
  })
  [UploadField.HEIGHT]?: number;

  @ApiProperty({
    description: 'File size in bytes',
    example: 204800,
  })
  [UploadField.BYTES]: number;

  @ApiProperty({
    description: 'Upload timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  [CommonField.CREATED_AT]: string;
}
