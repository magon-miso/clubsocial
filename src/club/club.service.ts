import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException, } from '../shared/errors/business-errors';
import { ClubEntity } from './club.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepo: Repository<ClubEntity>,
  ) {}

  async findAll(): Promise<ClubEntity[]> {
    return await this.clubRepo.find({ relations: ['socios'] }); 
  }

  async findOne(id: string): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepo.findOne({ where: { id }, relations: ['socios'], }); 
    if (!club)
      throw new BusinessLogicException('The club with the given id was not found', BusinessError.NOT_FOUND, );
    return club;
  }

  async create(club: ClubEntity, ): Promise<ClubEntity> {
    if (club.description.length>100) 
      throw new BusinessLogicException('The club description is too long', BusinessError.PRECONDITION_FAILED, );
    return await this.clubRepo.save(club);
  }

  async update( id: string, club: ClubEntity,): Promise<ClubEntity> {
    const persistedClub: ClubEntity = await this.clubRepo.findOne({ where: { id } });
    if (!persistedClub)
      throw new BusinessLogicException('The club with the given id was not found', BusinessError.NOT_FOUND,);

    if (club.description.length>100) 
      throw new BusinessLogicException('The club description is too long', BusinessError.PRECONDITION_FAILED, );

    club.id = id;
    return await this.clubRepo.save(club);
  }

  async delete(id: string) {
    const club: ClubEntity = await this.clubRepo.findOne({ where: { id } });
    if (!club)
      throw new BusinessLogicException('The club with the given id was not found', BusinessError.NOT_FOUND, );
    await this.clubRepo.remove(club);
  }
}
