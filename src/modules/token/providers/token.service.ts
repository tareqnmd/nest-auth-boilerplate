import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import { CreateTokenDto } from '../dto';
import { Token, TokenDocument } from '../token.schema';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async create(createTokenDto: CreateTokenDto) {
    try {
      await this.removeByUserId(createTokenDto[TokenField.USER_ID]);
      const token = new this.tokenModel(createTokenDto);
      const savedToken = await token.save();
      return savedToken;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.error,
      );
    }
  }

  async findByToken(token: string): Promise<TokenDocument | null> {
    try {
      const foundToken = await this.tokenModel.findOne({ token }).exec();
      if (!foundToken) {
        throw new NotFoundException(responseMessage.token.notFound);
      }
      return foundToken;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.error,
      );
    }
  }

  async removeByUserId(userId: string): Promise<boolean> {
    try {
      await this.tokenModel.deleteMany({ userId }).exec();
      return true;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.error,
      );
    }
  }

  async removeByToken(token: string): Promise<boolean> {
    try {
      await this.tokenModel.deleteOne({ token }).exec();
      return true;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.error,
      );
    }
  }

  async removeExpiredTokens(): Promise<number> {
    try {
      const result = await this.tokenModel
        .deleteMany({ expiresAt: { $lt: new Date() } })
        .exec();
      if (!result) {
        return 0;
      }
      return result?.deletedCount ?? 0;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.common.error,
      );
    }
  }
}
