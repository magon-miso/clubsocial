import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { ClubEntity } from '../club/club.entity';
import { ClubService } from '../club/club.service';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let entityList: SocioEntity[];

  let club: ClubEntity;
  let clubService: ClubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService, ClubService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    clubService = module.get<ClubService>(ClubService,);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity),);
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    entityList = [];
    for (let i = 0; i < 3; i++) {
      const entity: SocioEntity = await repository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.birthdate().toString()
      });
      entityList.push(entity);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const entities: SocioEntity[] = await service.findAll();
    expect(entities).not.toBeNull();
    expect(entities).toHaveLength(entityList.length);
  });

  it('findOne should return a socio by id', async () => {
    const found: SocioEntity = await service.findOne(entityList[0].id);
    expect(found).not.toBeNull();
    expect(found.username).toEqual(entityList[0].username);
    expect(found.email).toEqual(entityList[0].email);
  });

  it('findOne should throw an exception for not valid socio', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message', 'The socio with the given id was not found',
    );
  });

  it('create should return a new socio', async () => {
    const clubEntity: ClubEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.words(6),
      image: faker.image.url(),
      foundationDate: faker.date.past().toString(), 
      socios: [],
    };

    const clubCreated: ClubEntity = await clubService.create(clubEntity,);
    expect(clubCreated).not.toBeNull();

    const entity: SocioEntity = {
      id: '',
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.birthdate().toString(),
      clubes: [clubCreated],
    };

    const created: SocioEntity = await service.create(entity);
    expect(created).not.toBeNull();

    const stored: SocioEntity = await repository.findOne({where: { id: created.id },});
    expect(stored).not.toBeNull();
    expect(stored.username).toEqual(created.username);
    expect(stored.email).toEqual(created.email);
  });

  it('update should modify a socio', async () => {
    const entity: SocioEntity = entityList[0];
    entity.username = 'new-username';
    entity.email = 'new-email@email.com';

    const updated: SocioEntity = await service.update(entity.id, entity);
    expect(updated).not.toBeNull();

    const stored: SocioEntity = await repository.findOne({where: { id: entity.id },});
    expect(stored).not.toBeNull();
    expect(stored.username).toEqual(entity.username);
    expect(stored.email).toEqual(entity.email);
  });

  it('update should throw an exception for a not valid socio', async () => {
    let entity: SocioEntity = entityList[0];
    entity = {
      ...entity,
      username: 'new-username',
      email: 'new-email@email.com',
    };
    await expect(() => service.update('0', entity)).rejects.toHaveProperty(
      'message', 'The socio with the given id was not found',
    );
  });

  it('delete should remove a socio', async () => {
    const entity: SocioEntity = entityList[0];
    await service.delete(entity.id);
    const deleted: SocioEntity = await repository.findOne({ where: { id: entity.id }, });
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for a not valid socio', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message', 'The socio with the given id was not found',
    );
  });
});