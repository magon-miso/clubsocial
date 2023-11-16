import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { BusinessLogicException, BusinessError, } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class ClubSocioService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,

    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async addMemberToClub(clubId: string, socioId: string) {
    const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId }, });
    if (!socio)
      throw new BusinessLogicException( 'The socio with the given id was not found', BusinessError.NOT_FOUND, );

    const club: ClubEntity = await this.clubRepository.findOne({where: { id: clubId }, relations: ['socios'], });
    if (!club)
      throw new BusinessLogicException( 'The club with the given id was not found', BusinessError.NOT_FOUND, );

      club.socios = [...club.socios, socio];
    return await this.clubRepository.save(club);
  }

  async findMembersFromClub( clubId: string, ): Promise<SocioEntity[]> {
    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ['socios'], });
    if (!club)
      throw new BusinessLogicException( 'The club with the given id was not found', BusinessError.NOT_FOUND, );
    return club.socios;
  }

  async findMemberFromClub( clubId: string, socioId: string, ): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId }, });
    if (!socio)
      throw new BusinessLogicException( 'The socio with the given id was not found', BusinessError.NOT_FOUND, );

    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ['socios'], });
    if (!club)
      throw new BusinessLogicException('The club with the given id was not found', BusinessError.NOT_FOUND, );

    const clubSocio: SocioEntity = await club.socios.find((partner) => partner.id === socioId);
    if (!clubSocio)
      throw new BusinessLogicException( 'The socio with the given id is not associated with the club', BusinessError.PRECONDITION_FAILED,);
    return clubSocio;
  }

  async updateMembersFromClub( clubId: string, socios: SocioEntity[],): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({where: { id: clubId }, relations: ['socios'], });
    if (!club)
      throw new BusinessLogicException( 'The club with the given id was not found', BusinessError.NOT_FOUND, );

    for (const socio of socios) {
      const socioFound: SocioEntity = await this.socioRepository.findOne({ where: { id: socio.id }, });
      if (!socioFound)
        throw new BusinessLogicException('The socio with the given id was not found', BusinessError.NOT_FOUND,);
    }

    club.socios = [...club.socios, ...socios];
    return await this.clubRepository.save(club);
  }

  async deleteMemberFromClub(clubId: string, socioId: string,): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId }, relations: ['socios'],});
    if (!club)
      throw new BusinessLogicException('The club with the given id was not found', BusinessError.NOT_FOUND, );

    const socio = await this.socioRepository.findOne({where: { id: socioId }, });
    if (!socio)
      throw new BusinessLogicException('The socio with the given id was not found', BusinessError.NOT_FOUND, );
    
    const socioClub: SocioEntity = await club.socios.find((partner) => partner.id === socioId);
    if (!socioClub)
      throw new BusinessLogicException('The socio with the given id is not associated with the club', BusinessError.PRECONDITION_FAILED,);

    club.socios = club.socios.filter((partner) => partner.id !== socioId,);
    return await this.clubRepository.save(club);
  }
}