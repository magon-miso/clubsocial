import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { ClubSocioService } from './club-socio.service';
// import { ClubSocioController } from './club-socio.controller';
import { ClubSocioController } from './club-socio.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClubEntity, SocioEntity]),
  ],
  providers: [ClubSocioService],
  controllers: [ClubSocioController],
  //controllers: [ClubSocioController],
})
export class ClubSocioModule {}
