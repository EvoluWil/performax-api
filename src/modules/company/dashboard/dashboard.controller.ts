import { Controller, Get, Param, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { DashboardService } from './dashboard.service';

@Controller('companies/:companyId/dashboard')
@RequirePermission('dashboard', 'READ')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  get(
    @Param('companyId') companyId: string,
    @Query('month') month: string | undefined,
    @AuthUser() user: User,
  ) {
    return this.dashboardService.get(companyId, user.id, month);
  }
}
