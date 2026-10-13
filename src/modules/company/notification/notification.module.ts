import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PushDeviceController } from './push-device.controller';

@Module({
  controllers: [NotificationController, PushDeviceController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
