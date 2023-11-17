import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException, } from '../shared/errors/business-errors';
import { SocioEntity } from './socio.entity';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepo: Repository<SocioEntity>,
  ) {}

  async findAll(): Promise<SocioEntity[]> {
    return await this.socioRepo.find({ relations: ['clubes'] }); 
  }

  async findOne(id: string): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepo.findOne({ where: { id }, relations: ['clubes'], }); 
    if (!socio)
      throw new BusinessLogicException('The socio with the given id was not found', BusinessError.NOT_FOUND, );
    return socio;
  }

  async create(socio: SocioEntity, ): Promise<SocioEntity> {
    const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    if (!emailRegex.test(socio.email)) 
      throw new BusinessLogicException('The socio email format is not correct', BusinessError.PRECONDITION_FAILED, );
    return await this.socioRepo.save(socio);
  }

  async update( id: string, socio: SocioEntity,): Promise<SocioEntity> {
    const persistedSocio: SocioEntity = await this.socioRepo.findOne({ where: { id } });
    if (!persistedSocio)
      throw new BusinessLogicException('The socio with the given id was not found', BusinessError.NOT_FOUND,);

    const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    if (!emailRegex.test(socio.email)) 
      throw new BusinessLogicException('The socio email format is not correct', BusinessError.PRECONDITION_FAILED, );
  
    socio.id = id;
    return await this.socioRepo.save(socio);
  }

  async delete(id: string) {
    const socio: SocioEntity = await this.socioRepo.findOne({ where: { id } });
    if (!socio)
      throw new BusinessLogicException('The socio with the given id was not found', BusinessError.NOT_FOUND, );
    await this.socioRepo.remove(socio);
  }
}
