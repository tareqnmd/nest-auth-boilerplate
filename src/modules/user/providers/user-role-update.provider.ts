import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import responseMessage from '../../../common/messages/response.message';
import { UserRoleUpdateDto } from '../dto/user-role-update.dto';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class UserRoleUpdateProvider {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async userRoleUpdate(id: string, userRoleUpdateDto: UserRoleUpdateDto) {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { role: userRoleUpdateDto.role },
        { new: true, runValidators: true },
      )
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException(responseMessage.user.notFound);
    }

    return {
      success: true,
      message: responseMessage.user.roleUpdated,
      data: user,
    };
  }
}
