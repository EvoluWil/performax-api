import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('companies/:companyId/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(
    @Body() createClientDto: CreateClientDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.clientService.create(createClientDto, companyId, user.id);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.clientService.findAll(companyId);
  }

  @Get(':clientId')
  findOne(
    @Param('clientId') clientId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.clientService.findOne(clientId, companyId);
  }

  @Put(':clientId')
  update(
    @Param('clientId') clientId: string,
    @Param('companyId') companyId: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.update(clientId, companyId, updateClientDto);
  }

  @Delete(':clientId')
  remove(
    @Param('clientId') clientId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.clientService.remove(clientId, companyId);
  }
}
