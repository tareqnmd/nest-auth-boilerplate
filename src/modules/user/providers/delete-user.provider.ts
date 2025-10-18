import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import { UserRoleEnum } from '../enum';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class DeleteUserProvider {
  private readonly logger = new Logger(DeleteUserProvider.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async deleteUser(
    id: string,
    currentUserId: string,
    currentUserRole: UserRoleEnum,
  ) {
    try {
      if (id === currentUserId) {
        throw new BadRequestException(responseMessage.user.cannotDeleteOwn);
      }

      const userToDelete = await this.userModel.findById(id).exec();
      if (!userToDelete) {
        throw new NotFoundException(responseMessage.user.notFound);
      }

      if (
        userToDelete[UserField.ROLE] === UserRoleEnum.ADMIN &&
        currentUserRole !== UserRoleEnum.ADMIN
      ) {
        throw new ForbiddenException(responseMessage.user.cannotDeleteAdmin);
      }

      await this.userModel.findByIdAndDelete(id).exec();
      return { success: true, message: responseMessage.user.deleted };
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.updateUserError,
      );
    }
  }
}
