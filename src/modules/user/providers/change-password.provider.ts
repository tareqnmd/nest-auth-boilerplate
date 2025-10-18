import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserField } from '../../../common/enum';
import responseMessage from '../../../common/messages/response.message';
import { HashingProvider } from '../../../modules/hashing/providers';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class ChangePasswordProvider {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(responseMessage.user.notFound);
    }

    if (!user[UserField.PASSWORD]) {
      throw new UnauthorizedException(
        responseMessage.password.cannotChangeForSocial,
      );
    }

    const isPasswordValid = await this.hashingProvider.compare(
      changePasswordDto[UserField.OLD_PASSWORD],
      user[UserField.PASSWORD],
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(responseMessage.password.invalidOld);
    }

    const hashedNewPassword = await this.hashingProvider.hash(
      changePasswordDto[UserField.NEW_PASSWORD],
    );

    user[UserField.PASSWORD] = hashedNewPassword;
    await user.save();

    return {
      success: true,
      message: responseMessage.password.changed,
    };
  }
}
