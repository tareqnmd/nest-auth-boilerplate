import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import { Configuration, ConfigurationDocument } from '../configuration.schema';
import { CreateConfigurationDto, UpdateConfigurationDto } from '../dto';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectModel(Configuration.name)
    private readonly configurationModel: Model<ConfigurationDocument>,
  ) {}

  async create(
    createConfigurationDto: CreateConfigurationDto,
    createdBy: string,
  ): Promise<Configuration> {
    try {
      const configuration = new this.configurationModel({
        ...createConfigurationDto,
        [CommonField.CREATED_BY]: createdBy,
      });

      return await configuration.save();
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        'Failed to create configuration',
      );
    }
  }

  async findAll(): Promise<Configuration[]> {
    try {
      return await this.configurationModel.find().sort({ key: 1 }).exec();
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        'Failed to fetch all configurations',
      );
    }
  }

  async findOne(id: string): Promise<Configuration> {
    try {
      const configuration = await this.configurationModel.findById(id).exec();
      if (!configuration) {
        throw new NotFoundException('Configuration not found');
      }
      return configuration;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        'Failed to find configuration',
      );
    }
  }

  async update(
    id: string,
    updateConfigurationDto: UpdateConfigurationDto,
  ): Promise<Configuration> {
    try {
      const configuration = await this.configurationModel
        .findByIdAndUpdate(id, updateConfigurationDto, { new: true })
        .exec();

      if (!configuration) {
        throw new NotFoundException('Configuration not found');
      }

      return configuration;
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        'Failed to update configuration',
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.configurationModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('Configuration not found');
      }
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        'Failed to remove configuration',
      );
    }
  }
}
