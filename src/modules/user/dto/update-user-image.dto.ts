import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'User profile image file',
  })
  @IsNotEmpty()
  image: Express.Multer.File;
}
