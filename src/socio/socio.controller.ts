import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put,  UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { SocioDTO } from './socio.dto';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
  constructor(private readonly socioService: SocioService) {}

  @Get()
  async findAll() {
    return await this.socioService.findAll();
  }

  @Get(':memberId')
  async findOne(@Param('memberId') memberId: string) {
    return await this.socioService.findOne(memberId);
  }

  @Post()
  async create(@Body() socioDTO: SocioDTO) {
    const socio: SocioEntity = plainToInstance(SocioEntity, socioDTO);
    return await this.socioService.create(socio);
  }

  @Put(':memberId')
  async update( @Param('memberId') memberId: string, @Body() socioDTO: SocioDTO, ) {
    const socio: SocioEntity = plainToInstance(SocioEntity, socioDTO);
    return await this.socioService.update(memberId, socio);
  }

  @Delete(':memberId')
  @HttpCode(204)
  async delete(@Param('memberId') memberId: string) {
    return await this.socioService.delete(memberId);
  }
}