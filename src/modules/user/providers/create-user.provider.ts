import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorHandlerHelper } from '../../../common/helper/error-handler.helper';
import responseMessage from '../../../common/messages/response.message';
import { SignUpDtoWithSocial } from '../../auth/dto/sign-up-social.dto';
import { SignUpDto } from '../../auth/dto/sign-up.dto';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class CreateUserProvider {
  private readonly logger = new Logger(CreateUserProvider.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(signUpDto: SignUpDto | SignUpDtoWithSocial) {
    try {
      const newUser = new this.userModel(signUpDto);
      return await newUser.save();
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.createUserError,
      );
    }
  }
}
