import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { SocioEntity } from '../socio/socio.entity';
import { SocioService } from '../socio/socio.service';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let entityList: ClubEntity[];

  let gastro: SocioEntity;
  let socioService: SocioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService, SocioService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    socioService = module.get<SocioService>(SocioService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    entityList = [];
    for (let i = 0; i < 3; i++) {
      const entity: ClubEntity = await repository.save({
        name: faker.lorem.sentence({ min: 3, max: 6 }),
        description: faker.lorem.paragraphs({ min: 3, max: 6 }),
        image: faker.image.url(),
        foundationDate: faker.date.past().toString()
      });
      entityList.push(entity);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const entities: ClubEntity[] = await service.findAll();
    expect(entities).not.toBeNull();
    expect(entities).toHaveLength(entityList.length);
  });

  it('findOne should return a club by id', async () => {
    const found: ClubEntity = await service.findOne(entityList[0].id);
    expect(found).not.toBeNull();
    expect(found.name).toEqual(entityList[0].name);
    expect(found.description).toEqual(entityList[0].description);
  });

  it('findOne should throw an exception for a not valid club', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message', 'The club with the given id was not found',
    );
  });

  it('create should return a new club', async () => {
    const socio: SocioEntity = {
      id: '',
      username: faker.lorem.sentence({ min: 3, max: 6 }),
      email: faker.internet.email(),
      birthdate: faker.lorem.word(), 
      clubes: [],
    };

    const socioCreated: SocioEntity = await socioService.create(socio, );
    expect(socioCreated).not.toBeNull();

    const entity: ClubEntity = {
      id: '',
      name: faker.lorem.sentence({ min: 3, max: 6 }),
      description: faker.lorem.paragraphs({ min: 3, max: 6 }),
      image: faker.image.url(),
      foundationDate: faker.date.past().toString(),  
      socios: [socioCreated],
    };

    const created: ClubEntity = await service.create(entity);
    expect(created).not.toBeNull();

    const stored: ClubEntity = await repository.findOne({ where: { id: created.id }, });
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(created.name);
    expect(stored.description).toEqual(created.description);
  });

  it('update should modify a club', async () => {
    const entity: ClubEntity = entityList[0];
    entity.name = 'new-club-name';
    entity.description = 'new-club-description';

    const updated: ClubEntity = await service.update(entity.id, entity);
    expect(updated).not.toBeNull();

    const stored: ClubEntity = await repository.findOne({ where: { id: entity.id }, });
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(entity.name);
    expect(stored.description).toEqual(entity.description);
  });

  it('update should throw an exception for a not valid club', async () => {
    let entity: ClubEntity = entityList[0];
    entity = {
      ...entity,
      name: 'New name',
      description: 'New description',
    };
    await expect(() => service.update('0', entity)).rejects.toHaveProperty(
      'message', 'The club with the given id was not found',
    );
  });

  it('delete should remove a club', async () => {
    const entity: ClubEntity = entityList[0];
    await service.delete(entity.id);
    const deleted: ClubEntity = await repository.findOne({ where: { id: entity.id }, });
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for a not valid club', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message', 'The club with the given id was not found',
    );
  });
});