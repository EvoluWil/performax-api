import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { RequirePermission } from 'src/decorators/require-permission.decorator';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('companies/:companyId/clients')
@RequirePermission('client', 'FILTER')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @RequirePermission('client', 'WRITE')
  create(
    @Body() createClientDto: CreateClientDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.clientService.create(createClientDto, companyId, user.id);
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.clientService.findAll(companyId, user.id);
  }

  @Get(':clientId/fiscal-status')
  getFiscalStatus(
    @Param('clientId') clientId: string,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Query('resolveCep') resolveCep?: string,
  ) {
    return this.clientService.getFiscalStatus(
      clientId,
      companyId,
      user.id,
      resolveCep === 'true',
    );
  }

  @Get(':clientId')
  findOne(
    @Param('clientId') clientId: string,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.clientService.findOne(clientId, companyId, user.id);
  }

  @Put(':clientId')
  @RequirePermission('client', 'WRITE')
  update(
    @Param('clientId') clientId: string,
    @Param('companyId') companyId: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.update(clientId, companyId, updateClientDto);
  }

  @Delete(':clientId')
  @RequirePermission('client', 'ADMIN')
  remove(
    @Param('clientId') clientId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.clientService.remove(clientId, companyId);
  }
}
