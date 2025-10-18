import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorHandlerHelper } from '../../../common/helper';
import { UserResponseHelper } from '../../../common/helper/user-response.helper';
import responseMessage from '../../../common/messages/response.message';
import { UpdateUserDto, UpdateUserSocialIdDto } from '../dto';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class UpdateUserProvider {
  private readonly logger = new Logger(UpdateUserProvider.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto | UpdateUserSocialIdDto,
  ) {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!user) {
        throw new NotFoundException(responseMessage.user.notFound);
      }
      return UserResponseHelper.generateUserResponse(user as UserDocument);
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.updateUserError,
      );
    }
  }
}
