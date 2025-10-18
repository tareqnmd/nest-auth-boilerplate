import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CIRCUIT_BREAKER_CONSTANTS } from '../../../common/constants';
import { SendMailDtoField } from '../../../common/enum';
import { ErrorHandlerHelper } from '../../../common/helper';
import responseMessage from '../../../common/messages/response.message';
import { CircuitBreaker } from '../../../common/utils';
import { MailResponseDto, SendMailDto } from '../dto';

@Injectable()
export class SendMailProvider {
  private readonly logger = new Logger(SendMailProvider.name);
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },
    });

    this.circuitBreaker = new CircuitBreaker('EmailService', {
      failureThreshold: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_FAILURE_THRESHOLD,
      successThreshold: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_SUCCESS_THRESHOLD,
      timeout: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_TIMEOUT,
      monitoringPeriod: CIRCUIT_BREAKER_CONSTANTS.DEFAULT_MONITORING_PERIOD,
    });
  }

  async sendMail(sendMailDto: SendMailDto): Promise<MailResponseDto> {
    try {
      const info = await this.circuitBreaker.execute(async () => {
        return await this.transporter.sendMail({
          [SendMailDtoField.FROM]: this.configService.get<string>('mail.from'),
          [SendMailDtoField.TO]: sendMailDto[SendMailDtoField.TO],
          [SendMailDtoField.SUBJECT]: sendMailDto[SendMailDtoField.SUBJECT],
          [SendMailDtoField.TEXT]: sendMailDto[SendMailDtoField.TEXT],
          [SendMailDtoField.HTML]: sendMailDto[SendMailDtoField.HTML],
        });
      });

      const messageId: string =
        typeof info.messageId === 'string' ? info.messageId : 'unknown';
      this.logger.log(`Email sent successfully: ${messageId}`);

      return {
        success: true,
        messageId,
        message: responseMessage.communication.emailSentSuccess,
      };
    } catch (error) {
      ErrorHandlerHelper.handleError(
        error,
        this.logger,
        responseMessage.communication.emailSentFailed,
      );
    }
  }
}
