import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller({ path: 'email', version: '1' })
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }
}
