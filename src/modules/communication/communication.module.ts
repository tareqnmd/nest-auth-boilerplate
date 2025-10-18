import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mailConfig from '../../config/mail.config';
import { CommunicationService } from './providers/communication.service';
import { SendMailProvider } from './providers/send-mail.provider';

@Module({
  imports: [ConfigModule.forFeature(mailConfig)],
  providers: [CommunicationService, SendMailProvider],
  exports: [CommunicationService, SendMailProvider],
})
export class CommunicationModule {}
