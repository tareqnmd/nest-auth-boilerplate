import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserResponseHelper } from '../../../common/helper/user-response.helper';
import responseMessage from '../../../common/messages/response.message';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class UpdateUserStatusProvider {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async updateUserStatus(id: string, updateUserStatusDto: UpdateUserStatusDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      updateUserStatusDto,
      {
        new: true,
      },
    );
    if (!user) {
      throw new NotFoundException(responseMessage.user.notFound);
    }
    return UserResponseHelper.generateUserResponse(user as UserDocument);
  }
}
