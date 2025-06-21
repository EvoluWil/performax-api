import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('companies/:companyId/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createClientDto: CreateClientDto,
  ) {
    return this.clientService.create(companyId, createClientDto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.clientService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
