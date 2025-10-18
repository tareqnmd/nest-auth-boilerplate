import { Injectable } from '@nestjs/common';
import { SendMailDto } from '../dto';
import { SendMailProvider } from './send-mail.provider';

@Injectable()
export class CommunicationService {
  constructor(private readonly sendMailProvider: SendMailProvider) {}

  sendMail(sendMailDto: SendMailDto) {
    return this.sendMailProvider.sendMail(sendMailDto);
  }
}
