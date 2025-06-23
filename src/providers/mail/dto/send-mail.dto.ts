import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export enum MailTypeEnum {
  WELCOME = 'WELCOME',
  WELCOME_NEW_COMPANY = 'WELCOME_NEW_COMPANY',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  NEW_ACCOUNT = 'NEW_ACCOUNT',
}

export class SendMailDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(MailTypeEnum)
  type: MailTypeEnum;

  @IsString()
  @IsNotEmpty()
  username: string;

  @ValidateIf(
    (o) =>
      o.type === MailTypeEnum.FORGOT_PASSWORD ||
      o.type === MailTypeEnum.NEW_ACCOUNT,
  )
  @IsString()
  @IsNotEmpty()
  code?: string;

  @ValidateIf(
    (o) =>
      o.type === MailTypeEnum.FORGOT_PASSWORD ||
      o.type === MailTypeEnum.NEW_ACCOUNT,
  )
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ValidateIf(
    (o) =>
      o.type === MailTypeEnum.NEW_ACCOUNT ||
      o.type === MailTypeEnum.WELCOME_NEW_COMPANY,
  )
  @IsString()
  @IsNotEmpty()
  companyName?: string;
}
