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
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { GenerateRecurringDto } from './dto/generate-recurring.dto';
import { SignedAttachmentDto } from './dto/signed-attachment.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('companies/:companyId/contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  create(
    @Body() createContractDto: CreateContractDto,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.contractService.create(
      createContractDto,
      companyId,
      user.id,
    );
  }

  @Get()
  findAll(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
  ) {
    return this.contractService.findAll(companyId, user.id);
  }

  @Get(':contractId')
  findOne(
    @Param('contractId') contractId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.contractService.findOne(contractId, companyId);
  }

  @Put(':contractId')
  update(
    @Param('contractId') contractId: string,
    @Param('companyId') companyId: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(
      contractId,
      companyId,
      updateContractDto,
    );
  }

  @Put(':contractId/signed-attachment')
  updateSignedAttachment(
    @Param('contractId') contractId: string,
    @Param('companyId') companyId: string,
    @Body() signedAttachmentDto: SignedAttachmentDto,
  ) {
    return this.contractService.updateSignedAttachment(
      contractId,
      companyId,
      signedAttachmentDto,
    );
  }

  @Put(':contractId/inactivate')
  inactivate(
    @Param('contractId') contractId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.contractService.inactivate(contractId, companyId);
  }

  @Put(':contractId/activate')
  activate(
    @Param('contractId') contractId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.contractService.activate(contractId, companyId);
  }

  @Post(':contractId/generate-recurring')
  generateRecurring(
    @Param('contractId') contractId: string,
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Body() generateRecurringDto: GenerateRecurringDto,
  ) {
    return this.contractService.generateRecurring(
      contractId,
      companyId,
      user.id,
      generateRecurringDto,
    );
  }

  @Delete(':contractId')
  remove(
    @Param('contractId') contractId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.contractService.remove(contractId, companyId);
  }
}
