import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { MailTypeEnum, SendMailDto } from './dto/send-mail.dto';
import { newAccountWithoutPasswordTemplate } from './template/new-account-without-password.template';
import { newAccountTemplate } from './template/new-account.template';
import { newCompanyTemplate } from './template/new-company.template';
import { recoveryPasswordTemplate } from './template/recovery-password.template';

@Injectable()
export class MailService {
  private readonly templates = {
    [MailTypeEnum.WELCOME]: (data) => newAccountTemplate(data.username),
    [MailTypeEnum.FORGOT_PASSWORD]: (data) =>
      recoveryPasswordTemplate(data.username, data.code, data.email),
    [MailTypeEnum.NEW_ACCOUNT]: (data) =>
      newAccountWithoutPasswordTemplate(
        data.username,
        data.code,
        data.email,
        data.companyName,
      ),
    [MailTypeEnum.WELCOME_NEW_COMPANY]: (data) =>
      newCompanyTemplate(data.username, data.companyName),
  };

  async sendMail({ to, subject, type, ...rest }: SendMailDto) {
    const htmlContent = this.templates[type](rest);

    const content = {
      to: [
        {
          email: to,
          name: rest.username,
        },
      ],
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_EMAIL_NAME,
      },
      subject,
      htmlContent,
    };

    try {
      const { data } = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        content,
        {
          headers: { 'api-key': process.env.SENDINBLUE_API_KEY },
        },
      );
      return data;
    } catch (error: any) {
      return { error: 'Não foi possível enviar o email', ok: false };
    }
  }
}
