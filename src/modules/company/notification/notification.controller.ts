import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CompanyMember } from 'src/decorators/company-member.decorator';
import { NotificationService } from './notification.service';

@Controller('companies/:companyId/notifications')
@CompanyMember()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('unread-count')
  unreadCount(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Query('domain') domain?: string,
  ) {
    return this.notificationService.unreadCount(companyId, user.id, domain);
  }

  @Get()
  list(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Query('domain') domain?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationService.list(
      companyId,
      user.id,
      domain,
      cursor,
      limit,
    );
  }

  @Put('read-all')
  markAllRead(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Query('domain') domain?: string,
  ) {
    return this.notificationService.markAllRead(companyId, user.id, domain);
  }

  @Put(':notificationId/read')
  markRead(
    @Param('companyId') companyId: string,
    @Param('notificationId') notificationId: string,
    @AuthUser() user: User,
  ) {
    return this.notificationService.markRead(
      companyId,
      user.id,
      notificationId,
    );
  }
}
