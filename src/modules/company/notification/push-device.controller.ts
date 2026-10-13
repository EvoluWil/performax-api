import { Body, Controller, Delete, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { DeletePushDeviceDto, UpsertPushDeviceDto } from './dto/push-device.dto';
import { NotificationService } from './notification.service';

@Controller('push-devices')
export class PushDeviceController {
  constructor(private readonly notificationService: NotificationService) {}

  @Put()
  upsert(@AuthUser() user: User, @Body() dto: UpsertPushDeviceDto) {
    return this.notificationService.upsertDevice(user.id, dto);
  }

  @Delete()
  remove(@AuthUser() user: User, @Body() dto: DeletePushDeviceDto) {
    return this.notificationService.removeDevice(user.id, dto);
  }
}
