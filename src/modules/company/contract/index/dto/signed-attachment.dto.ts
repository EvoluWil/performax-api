import { File } from '@prisma/client';
import { IsNotEmpty, IsObject } from 'class-validator';

export class SignedAttachmentDto {
  @IsObject()
  @IsNotEmpty()
  attachment: File;
}
