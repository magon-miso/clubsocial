import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>( ClubSocioService );
    clubRepository = module.get<Repository<ClubEntity>>( getRepositoryToken(ClubEntity) );
    socioRepository = module.get<Repository<SocioEntity>>( getRepositoryToken(SocioEntity) );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    sociosList = [];
    for (let i = 0; i < 9; i++) {
      const socio: SocioEntity = await socioRepository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.birthdate().toString(),
      });
      sociosList.push(socio);
    }

    club = await clubRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraphs({ min: 1, max: 2 }),
      image: faker.image.url(),
      foundationDate: faker.date.past().toString(), 
      socios: sociosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const createNewSocio = async () => {
    return await socioRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate().toString(),
      clubes: [],
    });
  };

  const createNewClub = async () => {
    return await clubRepository.save({
      name: faker.company.name(),
      description: faker.lorem.paragraphs({ min: 1, max: 2 }),
      image: faker.image.url(),
      foundationDate: faker.date.past().toString(), 
      socios: [],
    });
  };

  it('addMemberToClub should add a socio to a club', async () => {
    const newSocio: SocioEntity = await createNewSocio();
    const newclub: ClubEntity = await createNewClub();
    const result: ClubEntity = await service.addMemberToClub(newclub.id, newSocio.id,);
    expect(result).not.toBeNull();
    expect(result.socios).toHaveLength(1);
    expect(result.socios[0].id).toEqual(newSocio.id);
    expect(result.socios[0].username).toEqual(newSocio.username);
    expect(result.socios[0].email).toEqual(newSocio.email);
  });

  it('findMembersFromClub should return all socios by club id', async () => {
    const result: SocioEntity[] = await service.findMembersFromClub(club.id,);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(sociosList.length);
  });

  it('findMembersFromClub should throw an exception for a not valid club id', async () => {
    await expect(service.findMembersFromClub('0'),
    ).rejects.toHaveProperty( 'message', 'The club with the given id was not found',);
  });


  it('addMemberToClub should throw an exception for a not valid club id', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(service.addMemberToClub('0', socio.id),
    ).rejects.toHaveProperty('message', 'The club with the given id was not found', );
  });

  it('addMemberToClub should throw an exception for a not valid socio id', async () => {
    await expect(service.addMemberToClub(club.id, '0'),
    ).rejects.toHaveProperty('message', 'The socio with the given id was not found',);
  });

  it('findMemberFromClub should return a socio by club id and socio id', async () => {
    const socio: SocioEntity = sociosList[0];
    const result: SocioEntity = await service.findMemberFromClub(club.id, socio.id,);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(socio.id);
  });

  it('findMemberFromClub should throw an exception for a not valid club id', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(service.findMemberFromClub('0', socio.id),
    ).rejects.toHaveProperty('message', 'The club with the given id was not found',);
  });

  it('findMemberFromClub should throw an exception for aa not valid socio id', async () => {
    await expect(service.findMemberFromClub(club.id, '0',),
    ).rejects.toHaveProperty('message','The socio with the given id was not found',);
  });

  it('findMemberFromClub should throw an exception for a socio not associated with the club', async () => {
    const socio: SocioEntity = await createNewSocio();
    await expect(service.findMemberFromClub(club.id, socio.id,),
    ).rejects.toHaveProperty('message','The socio with the given id is not associated with the club',);
  });


  it('updateMembersFromClub should associate socios to a club', async () => {
    const newPartners: SocioEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const socio: SocioEntity = await createNewSocio();
      newPartners.push(socio);
    }    
    const result: ClubEntity = await service.updateMembersFromClub(club.id, newPartners, );
    expect(result).not.toBeNull();
    expect(result.socios).toHaveLength(12);
  });

  it('updateMembersFromClub should throw an exception for a not valid club id', async () => {
    const newPartners: SocioEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const socio: SocioEntity = await createNewSocio();
      newPartners.push(socio);
    }    
    await expect(service.updateMembersFromClub('0', newPartners),
    ).rejects.toHaveProperty('message','The club with the given id was not found',);
  });

  it('deleteMemberFromClub should remove a socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    const result: ClubEntity = await service.deleteMemberFromClub(club.id, socio.id, );
    expect(result).not.toBeNull();
    expect(result.socios).toHaveLength(8);
  });

  it('deleteMemberFromClub should throw an exception for a not valid club id', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(service.deleteMemberFromClub('0', socio.id),
    ).rejects.toHaveProperty('message', 'The club with the given id was not found',);
  });

  it('deleteMemberFromClub should throw an exception for a not valid socio id', async () => {
    await expect(service.deleteMemberFromClub(club.id, '0',),
    ).rejects.toHaveProperty('message', 'The socio with the given id was not found',);
  });

  it('deleteMemberFromClub should throw an exception for a socio not associated with the club', async () => {
    const socio: SocioEntity = await createNewSocio();
    await expect(service.deleteMemberFromClub(club.id, socio.id,),
    ).rejects.toHaveProperty('message', 'The socio with the given id is not associated with the club',);
  });

});
