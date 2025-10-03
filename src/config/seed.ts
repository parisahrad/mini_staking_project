import { Resource } from '../resource/entities/resource.entity';
import { AppDataSource } from './orm-config';
import { ResourceTypeEnum } from '../resource/resource.type';

const seed = async () => {
  try {
    await AppDataSource.initialize();

    const resourceRepo = AppDataSource.getRepository(Resource);

    const data: Resource[] = [
      {
        name: 'Room 101',
        type: ResourceTypeEnum.HOTEL_ROOM,
        description: 'room 1 in story 1',
        metadata: { beds: 1, cost: 100 },
        isActive: true,
        bookings: [],
      },
      {
        name: 'Room 201',
        type: ResourceTypeEnum.HOTEL_ROOM,
        description: 'room 1 in story 2',
        metadata: { beds: 2, cost: 200 },
        isActive: true,
        bookings: [],
      },
      {
        name: 'Room 102',
        type: ResourceTypeEnum.HOTEL_ROOM,
        description: 'room 2 in story 1',
        metadata: { beds: 2, cost: 100 },
        isActive: false,
        bookings: [],
      },
      {
        name: 'rock concert',
        type: ResourceTypeEnum.Event,
        description: 'concerts for summer night',
        metadata: { cost: 1000, capacity: 20000, performer: 'radiohead' },
        isActive: true,
        bookings: [],
      },
      {
        name: 'pop concert',
        type: ResourceTypeEnum.Event,
        description: 'concerts for summer night',
        metadata: { cost: 800, capacity: 5000, performer: 'lana del ray' },
        isActive: true,
        bookings: [],
      },
      {
        name: 'conference room',
        type: ResourceTypeEnum.MEETING_ROOM,
        description: 'for very formal meetings',
        metadata: { seats: 20 },
        isActive: true,
        bookings: [],
      },
      {
        name: 'planning room',
        type: ResourceTypeEnum.MEETING_ROOM,
        description: 'for sprint planning',
        metadata: { seats: 10 },
        isActive: true,
        bookings: [],
      },
    ];

    for (const item of data) {
      const exists = await resourceRepo.findOneBy({ name: item.name });
      if (!exists) {
        const resource = resourceRepo.create(item);
        await resourceRepo.save(resource);
      }
    }

    console.log('seeded done!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
};

seed();
