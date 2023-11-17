import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { SocioDTO } from '../socio/socio.dto';
import { SocioEntity } from '../socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
    constructor(private readonly service: ClubSocioService){}

    @Post(':clubId/members/:memberId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
       return await this.service.addMemberToClub(clubId, memberId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string){
       return await this.service.findMembersFromClub(clubId);
    }

    @Get(':clubId/members/:memberId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
       return await this.service.findMemberFromClub(clubId, memberId);
    }

    @Put(':clubId/members')
    async updateMembersFromClub(@Body() sociosDTO: SocioDTO[], @Param('clubId') clubId: string){
       const socios = plainToInstance(SocioEntity, sociosDTO)
       return await this.service.updateMembersFromClub(clubId, socios);
    }
 
    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
        return await this.service.deleteMemberFromClub(clubId, memberId);
    }

}